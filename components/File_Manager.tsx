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

const File_Manager = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files"); // local proxy route
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      }
    };
    fetchFiles();
  }, []);

  return (
    <div className="File_manager_container bg sh-s flex-col">
      <div className="wrapss flex-col pr-2 text-xs">
        {files.map((f) => {
          const Icon = !f.is_file
            ? FaFolder
            : f.mimetype.includes("zip")
            ? FaFileZipper
            : FaFileAlt;

          return <Files_Tab key={f.name} name={f.name} icon={Icon} />;
        })}
      </div>
    </div>
  );
};

export default File_Manager;
