// components/File_Manager.tsx
"use client";
import { useEffect, useState } from "react";
import { FaFileAlt } from "react-icons/fa";
import { FaFolder, FaFileZipper } from "react-icons/fa6";
import Files_Tab from "./Files_Tab";

interface FileInfo {
  name: string;
  is_file: boolean;
  mimetype: string;
}

interface FileManagerProps {
  onFolderClick: (folderName: string) => void;
  onFileClick: (fileName: string) => void;
}

const File_Manager: React.FC<FileManagerProps> = ({ onFolderClick, onFileClick }) => {
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  const handleItemClick = (file: FileInfo) => {
    if (!file.is_file) {
      // It's a folder
      onFolderClick(file.name);
    } else {
      // It's a file
      onFileClick(file.name);
    }
  };

  return (
    <div className="File_manager_container bg sh-s flex-col">
      <div className="wrapss flex-col pr-2 text-xs">
        {files.map((f) => {
          const Icon = !f.is_file
            ? FaFolder
            : f.mimetype.includes("zip")
            ? FaFileZipper
            : FaFileAlt;

          return (
            <div 
              key={f.name} 
              onClick={() => handleItemClick(f)}
              className="cursor-pointer"
            >
              <Files_Tab name={f.name} icon={Icon} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default File_Manager;