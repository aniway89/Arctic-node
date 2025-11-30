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
import MoveTo from "./MoveTo";

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
  const [showMoveTo, setShowMoveTo] = useState(false);
  const [closingMoveTo, setClosingMoveTo] = useState(false);
  const [archiving, setArchiving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [moving, setMoving] = useState(false); // Add moving state

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("viewMode", viewMode);
    }
  }, [viewMode]);

  // Generate archive name based on selection
  const generateArchiveName = (): string => {
    const selectedArray = Array.from(selectedFiles);
    
    if (selectedArray.length === 1) {
      // Single file: use filename without extension
      const fileName = selectedArray[0];
      const baseName = fileName.includes('.') ? fileName.split('.').slice(0, -1).join('.') : fileName;
      return `${baseName}.zip`;
    } else {
      // Multiple files: use "ArcticNode Arch" with incrementing number
      const baseName = "ArcticNode Arch";
      let finalName = `${baseName}.zip`;
      let counter = 1;
      
      // Check if name already exists and find available number
      const existingArchNames = files
        .filter(file => file.name.startsWith(baseName) && file.name.endsWith('.zip'))
        .map(file => file.name);
      
      while (existingArchNames.includes(finalName)) {
        finalName = `${baseName} (${counter}).zip`;
        counter++;
      }
      
      return finalName;
    }
  };

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

  // Archive handler with custom naming
  const handleArchive = async () => {
    if (selectedFiles.size === 0) return;

    setArchiving(true);
    try {
      const archiveName = generateArchiveName();
      console.log("Creating archive:", archiveName, "with files:", Array.from(selectedFiles));
      
      const response = await fetch('/api/files/compress', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          root: currentPath,
          files: Array.from(selectedFiles),
          archiveName: archiveName,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create archive');
      }

      console.log('Archive created successfully:', result);
      
      // Refresh the file list to show the new archive
      await fetchFiles(currentPath);
      
      // Clear selection after successful archive
      clearSelection();
      
      alert(`Archive created successfully: ${archiveName}`);
      
    } catch (error: any) {
      console.error('Error creating archive:', error);
      alert(`Failed to create archive: ${error.message}`);
    } finally {
      setArchiving(false);
    }
  };

  // Delete handler
  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    // Confirm deletion
    if (!confirm(`Are you sure you want to delete ${selectedFiles.size} item(s)? This action cannot be undone.`)) {
      return;
    }

    setDeleting(true);
    try {
      console.log("Deleting files:", Array.from(selectedFiles));
      
      const response = await fetch('/api/files/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          root: currentPath,
          files: Array.from(selectedFiles),
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to delete files');
      }

      console.log('Files deleted successfully');
      
      // Refresh the file list
      await fetchFiles(currentPath);
      
      // Clear selection after successful deletion
      clearSelection();
      
      alert(`Successfully deleted ${selectedFiles.size} item(s)`);
      
    } catch (error: any) {
      console.error('Error deleting files:', error);
      alert(`Failed to delete files: ${error.message}`);
    } finally {
      setDeleting(false);
    }
  };

  // Move handler
  const handleMove = () => {
    console.log("Moving files:", Array.from(selectedFiles));
    setShowMoveTo(true);
    setClosingMoveTo(false);
  };

  // Handle move completion - navigate to destination
  const handleMoveComplete = async (destinationPath: string) => {
    console.log("Move completed, navigating to:", destinationPath);
    
    // Navigate to the destination directory
    await fetchFiles(destinationPath);
    
    // Clear selection
    clearSelection();
    
    alert(`Files moved successfully to ${destinationPath}`);
  };

  // Close MoveTo component with animation
  const handleCloseMoveTo = () => {
    setClosingMoveTo(true);
    setTimeout(() => {
      setShowMoveTo(false);
      setClosingMoveTo(false);
    }, 300);
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
        archiving={archiving}
        deleting={deleting}
        moving={moving} // Pass moving state
      />

      {showMoveTo && (
        <MoveTo 
          onClose={handleCloseMoveTo} 
          closing={closingMoveTo}
          currentPath={currentPath}
          selectedFiles={Array.from(selectedFiles)}
          onMoveComplete={handleMoveComplete} // Pass the callback
        />
      )}
    </div>
  );
};

export default File_Expolor;