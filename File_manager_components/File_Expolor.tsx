"use client";
import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { MdViewList } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { FaFolder, FaFileZipper } from "react-icons/fa6";
import Files from "./Files";
import Selection_popup from "./Selection_popup";

interface FileInfo {
  name: string;
  is_file: boolean;
  mimetype: string;
  size?: number;
  modified_at?: string;
}

interface FileExpolorProps {
  setIsVisible: (value: boolean) => void;
  onFileOpen: (filePath: string, fileName: string) => void;
}

const File_Expolor: React.FC<FileExpolorProps> = ({ setIsVisible, onFileOpen }) => {
  const [closing, setClosing] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>("/");
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  
  // FIXED: Use the same initial state function as your old working version
  const [viewMode, setViewMode] = useState<"grid" | "list">(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("viewMode");
      return (saved === "grid" || saved === "list") ? saved : "grid";
    }
    return "grid";
  });

  // Fetch files for current directory
  const fetchFiles = async (directory: string = "/") => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?directory=${encodeURIComponent(directory)}`);
      const data = await res.json();
      setFiles(data);
      setCurrentPath(directory);
      // Clear selection and exit selection mode when changing directory
      setSelectedFiles(new Set());
      setIsSelectionMode(false);
    } catch (err) {
      console.error("Error fetching files:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFiles();
  }, []);

  // FIXED: Save view mode to localStorage when it changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      console.log("Saving viewMode to localStorage:", viewMode);
      localStorage.setItem("viewMode", viewMode);
    }
  }, [viewMode]);

  // Enter selection mode and select the specific file
  const enterSelectionMode = (fileName: string) => {
    setIsSelectionMode(true);
    handleFileSelect(fileName, true);
  };

  // Selection handlers
  const handleFileSelect = (fileName: string, selected: boolean) => {
    setSelectedFiles(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(fileName);
      } else {
        newSet.delete(fileName);
      }
      return newSet;
    });
  };

  const handleSelectAll = () => {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set());
    } else {
      const allFileNames = new Set(files.map(f => f.name));
      setSelectedFiles(allFileNames);
    }
  };

  const clearSelection = () => {
    setSelectedFiles(new Set());
    setIsSelectionMode(false);
  };

  // Handle folder click
  const handleFolderClick = (folderName: string) => {
    if (isSelectionMode) {
      handleFileSelect(folderName, !selectedFiles.has(folderName));
    } else {
      const newPath = currentPath === "/" 
        ? `/${folderName}` 
        : `${currentPath}/${folderName}`;
      fetchFiles(newPath);
    }
  };

  // Handle file click
  const handleFileClick = (fileName: string) => {
    if (isSelectionMode) {
      handleFileSelect(fileName, !selectedFiles.has(fileName));
    } else {
      const fileExtension = fileName.split('.').pop()?.toLowerCase();
      const supportedExtensions = ['json', 'yml', 'yaml', 'txt', 'js', 'ts', 'css', 'html'];
      
      if (fileExtension && supportedExtensions.includes(fileExtension)) {
        const filePath = currentPath === "/" 
          ? `/${fileName}` 
          : `${currentPath}/${fileName}`;
        onFileOpen(filePath, fileName);
      }
    }
  };

  // Handle path navigation
  const handlePathClick = (path: string) => {
    fetchFiles(path);
  };

  // Action handlers
  const handleMove = () => {
    console.log("Moving files:", Array.from(selectedFiles));
  };

  const handleArchive = () => {
    console.log("Archiving files:", Array.from(selectedFiles));
  };

  const handleDelete = () => {
    console.log("Deleting files:", Array.from(selectedFiles));
    clearSelection();
  };

  // Format time difference
  const formatTimeAgo = (modifiedAt?: string): string => {
    if (!modifiedAt) return "";
    const modifiedDate = new Date(modifiedAt);
    const now = new Date();
    const diffMs = now.getTime() - modifiedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 23) return "";

    const diffMins = diffMs / (1000 * 60);
    if (diffMins < 60) return `${Math.floor(diffMins)} min ago`;
    return `${Math.floor(diffHours)} hr ago`;
  };

  // View toggle function
  const toggleView = () => setViewMode((prev) => (prev === "grid" ? "list" : "grid"));

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  // Build path segments
  const pathSegments = [];
  let accumulatedPath = "";
  
  if (currentPath === "/") {
    pathSegments.push({ name: "Home", path: "/", isCurrent: true });
  } else {
    pathSegments.push({ name: "Home", path: "/", isCurrent: false });
    
    const parts = currentPath.split('/').filter(part => part);
    parts.forEach((part, index) => {
      accumulatedPath += `/${part}`;
      pathSegments.push({ 
        name: part, 
        path: accumulatedPath, 
        isCurrent: index === parts.length - 1 
      });
    });
  }

  return (
    <div className={`file_expolor flex bg-d sh-l ${closing ? "closing" : "popup"}`}>
      <div className="hader flex bg sh-l justify-between items-center text-c">
        File Manager
        <div className="close flex items-center cursor-pointer" onClick={handleClose}>
          <IoIosCloseCircle />
        </div>
      </div>

      <div className="filemanager-content-container bg sh-m">
        <div className="path flex items-center flex-wrap">
          {pathSegments.map((segment, index) => (
            <div key={segment.path} className="flex items-center">
              {index > 0 && <span className="mx-1">/</span>}
              <span 
                className={`path-segment cursor-pointer hover:underline ${
                  segment.isCurrent ? 'text-c' : ''
                }`}
                onClick={() => handlePathClick(segment.path)}
              >
                {segment.name}
              </span>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="notfound">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="notfound">Empty</div>
        ) : (
          <div className={`file-containers grid-cont wrapss ${viewMode}`}>
            {files.map((f) => {
              const Icon = !f.is_file
                ? FaFolder
                : f.mimetype.includes("zip")
                ? FaFileZipper
                : FaFileAlt;

              const timeDisplay = formatTimeAgo(f.modified_at);
              
              return (
                <Files
                  key={f.name}
                  title={f.name}
                  time={timeDisplay}
                  icon={<Icon className="text-3xl" />}
                  viewMode={viewMode}
                  isFolder={!f.is_file}
                  isSelected={selectedFiles.has(f.name)}
                  isSelectionMode={isSelectionMode}
                  onSelect={(selected) => handleFileSelect(f.name, selected)}
                  onLongPress={enterSelectionMode}
                  onClick={() => !f.is_file ? handleFolderClick(f.name) : handleFileClick(f.name)}
                />
              );
            })}
          </div>
        )} 
      </div>

      <div className="floatoing_buttons">
        <div className="upload_files floating_button bg-l">
          <FiUpload />
        </div>
        <div className="view-togle-button floating_button bg-l cursor-pointer" onClick={toggleView}>
          {viewMode === "grid" ? <MdViewList /> : <HiViewGrid />}
        </div>
      </div>

      <Selection_popup
        selectedCount={selectedFiles.size}
        onSelectAll={handleSelectAll}
        onClearSelection={clearSelection}
        onMove={handleMove}
        onArchive={handleArchive}
        onDelete={handleDelete}
        isAllSelected={selectedFiles.size === files.length && files.length > 0}
        isSelectionMode={isSelectionMode}
      />
    </div>
  );
};

export default File_Expolor;