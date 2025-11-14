"use client";
import { useState, useEffect } from "react";
import Move_File from "./Move_File";

interface FileInfo {
  name: string;
  is_file: boolean;
  mimetype: string;
  size?: number;
  modified_at?: string;
}

interface MoveToProps {
  onClose: () => void;
  closing?: boolean;
  currentPath: string;
  selectedFiles: string[];
  onMoveComplete: (destinationPath: string) => void;
}

const MoveTo = ({ onClose, closing, currentPath: initialPath, selectedFiles, onMoveComplete }: MoveToProps) => {
  const [folders, setFolders] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPath, setCurrentPath] = useState<string>(initialPath);
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);
  const [moving, setMoving] = useState(false);

  // Fetch folders for current directory (only folders, no files)
  const fetchFolders = async (directory: string = initialPath) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files?directory=${encodeURIComponent(directory)}`);
      const data = await res.json();
      
      // Filter only folders (is_file = false) AND exclude selected folders
      const foldersOnly = data.filter((item: FileInfo) => 
        !item.is_file && !selectedFiles.includes(item.name)
      );
      
      setFolders(foldersOnly);
      setCurrentPath(directory);
      setSelectedFolder(null);
    } catch (err) {
      console.error("Error fetching folders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchFolders(initialPath);
  }, [initialPath]);

  // Handle folder click - navigate into folder
  const handleFolderClick = (folderName: string) => {
    const newPath = currentPath === "/" 
      ? `/${folderName}` 
      : `${currentPath}/${folderName}`;
    fetchFolders(newPath);
  };

  // Handle folder selection for moving files
  const handleFolderSelect = (folderName: string) => {
    setSelectedFolder(folderName);
  };

  // Handle path navigation
  const handlePathClick = (path: string) => {
    fetchFolders(path);
  };

  // Handle move operation - FIXED
  const handleMove = async () => {
    if (selectedFiles.length === 0) return;

    setMoving(true);
    try {
      // Calculate destination path
      let destinationPath: string;
      
      if (selectedFolder) {
        // Move to selected folder
        destinationPath = currentPath === "/" 
          ? `/${selectedFolder}` 
          : `${currentPath}/${selectedFolder}`;
      } else {
        // Move to current directory
        destinationPath = currentPath;
      }

      console.log("Moving files to:", destinationPath, "Files:", selectedFiles);

      // Single API call to move all files
      const response = await fetch('/api/files/move', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          root: initialPath, // Original path where files were selected
          files: selectedFiles,
          destination: destinationPath,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle partial success (207 status)
        if (response.status === 207) {
          const failedCount = result.failedFiles?.length || 0;
          const successCount = selectedFiles.length - failedCount;
          
          if (successCount > 0) {
            // Some files were moved successfully
            onMoveComplete(destinationPath);
            alert(`Moved ${successCount} file(s) successfully. ${failedCount} file(s) failed to move.`);
          } else {
            // All files failed
            throw new Error(`Failed to move files: ${result.error}`);
          }
        } else {
          // Complete failure
          throw new Error(result.error || 'Failed to move files');
        }
      } else {
        // All files moved successfully
        console.log('All files moved successfully:', result);
        onMoveComplete(destinationPath);
        alert(`Successfully moved ${selectedFiles.length} file(s) to ${destinationPath}`);
      }
      
      // Close the MoveTo component
      onClose();
      
    } catch (error: any) {
      console.error('Error moving files:', error);
      alert(`Failed to move files: ${error.message}`);
    } finally {
      setMoving(false);
    }
  };

  // Build path segments with proper text colors
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
    <div className={`Move bg-d sh-l ${closing ? "closing" : "popup"}`}>
      <div className="move_path bg sh-l">
        <div className="path flex items-center flex-wrap">
          {pathSegments.map((segment, index) => (
            <div key={segment.path} className="flex items-center">
              {index > 0 && <span className="mx-1">/</span>}
              <span 
                className={`path-segment cursor-pointer hover:underline ${
                  segment.isCurrent ? 'text-c' : 'text-m'
                }`}
                onClick={() => handlePathClick(segment.path)}
              >
                {segment.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      
      <div className="file_contianer bg sh-m">
        <div className="holderofthe wrapss">
          {loading ? (
            <div className="notfound">Loading folders...</div>
          ) : folders.length === 0 ? (
            <div className="notfound">No folders available</div>
          ) : (
            folders.map((folder) => (
              <Move_File
                key={folder.name}
                folderName={folder.name}
                isSelected={selectedFolder === folder.name}
                onClick={() => handleFolderSelect(folder.name)}
                onDoubleClick={() => handleFolderClick(folder.name)}
              />
            ))
          )}
        </div>
      </div>
      
      <div className="butns bg sh-l flex items-center">
        <div 
          className="Select_folder Mbutton bg-l sh-m"
          onClick={handleMove}
          style={{ 
            opacity: moving ? 0.5 : 1,
            cursor: moving ? 'not-allowed' : 'pointer'
          }}
        >
          {moving ? 'Moving...' : selectedFolder ? `Move to ${selectedFolder}` : `Move to this folder`}
        </div>
        <div className="cancel_move Mbutton sh-l" onClick={onClose}>
          Cancel
        </div>
      </div>
    </div>
  );
};

export default MoveTo;