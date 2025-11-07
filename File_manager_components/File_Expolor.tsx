"use client";
import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import { MdViewList } from "react-icons/md";
import { FaFileAlt } from "react-icons/fa";
import { FaFolder, FaFileZipper } from "react-icons/fa6";
import Files from "./Files";

interface FileInfo {
  name: string;
  is_file: boolean;
  mimetype: string;
  size?: number;
  modified_at?: string;
}

interface FileExpolorProps {
  setIsVisible: (value: boolean) => void;
}

const File_Expolor: React.FC<FileExpolorProps> = ({ setIsVisible }) => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [closing, setClosing] = useState(false);
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch files
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const res = await fetch("/api/files");
        const data = await res.json();
        setFiles(data);
      } catch (err) {
        console.error("Error fetching files:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFiles();
  }, []);

  // Load and save user view preference
  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved === "grid" || saved === "list") setViewMode(saved);
  }, []);
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Format time difference
  const formatTimeAgo = (modifiedAt?: string): string => {
    if (!modifiedAt) return "";
    const modifiedDate = new Date(modifiedAt);
    const now = new Date();
    const diffMs = now.getTime() - modifiedDate.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours >= 23) return ""; // older than 23h → show nothing

    const diffMins = diffMs / (1000 * 60);
    if (diffMins < 60) return `${Math.floor(diffMins)} min ago`;
    return `${Math.floor(diffHours)} hr ago`;
  };

  const toggleView = () => setViewMode((prev) => (prev === "grid" ? "list" : "grid"));

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <div className={`file_expolor flex bg-d sh-l ${closing ? "closing" : "popup"}`}>
      <div className="hader flex bg sh-l justify-between items-center text-c">
        File Manager
        <div className="close flex items-center cursor-pointer" onClick={handleClose}>
          <IoIosCloseCircle />
        </div>
      </div>

      <div className="filemanager-content-container bg sh-m">
        <div className="path">Home/</div>

        {loading ? (
          <div className="text-c text-xs p-3">Loading files...</div>
        ) : files.length === 0 ? (
          <div className="text-c text-xs p-3">No files found.</div>
        ) : (
          <div className={`file-containers grid-cont wrapss ${viewMode}`}>
            {files.map((f) => {
              // choose correct icon
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
    </div>
  );
};

export default File_Expolor;
