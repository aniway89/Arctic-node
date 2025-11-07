"use client";

import { useEffect, useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { HiViewGrid } from "react-icons/hi";
import Files from "./Files";
import { MdViewList } from "react-icons/md";

const File_Expolor = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isVisible, setIsVisible] = useState(true); // For close animation
  const [closing, setClosing] = useState(false);

  // Load user preference
  useEffect(() => {
    const saved = localStorage.getItem("viewMode");
    if (saved === "grid" || saved === "list") setViewMode(saved);
  }, []);

  // Save preference when changed
  useEffect(() => {
    localStorage.setItem("viewMode", viewMode);
  }, [viewMode]);

  // Toggle between grid and list
  const toggleView = () => {
    setViewMode((prev) => (prev === "grid" ? "list" : "grid"));
  };

  // Close animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setIsVisible(false);
    }, 300); // matches animation time
  };

  if (!isVisible) return null;

  return (
    <div
      className={`file_expolor flex bg-d sh-l ${
        closing ? "closing" : "popup"
      }`}
    >
      <div className="hader flex bg sh-l justify-between items-center text-c">
        File Manager
        <div className="close flex items-center cursor-pointer" onClick={handleClose}>
          <IoIosCloseCircle />
        </div>
      </div>

      <div className="filemanager-content-container bg sh-m">
        <div className="path">Home/</div>

        <div className={`file-containers grid-cont wrapss ${viewMode}`}>
          <Files title="server.properties" time="4s ago" viewMode={viewMode} />
          <Files title="world" time="4s ago" viewMode={viewMode} />
          <Files title="times" time="4s ago" viewMode={viewMode} />
          <Files title="nether" time="4s ago" viewMode={viewMode} />
          <Files title="server jar" time="4s ago" viewMode={viewMode} />
          <Files title="over world" time="4s ago" viewMode={viewMode} />
        </div>
      </div>

      <div className="floatoing_buttons">
        <div className="upload_files floating_button bg-l">
          <FiUpload />
        </div>

        <div
          className="view-togle-button floating_button bg-l cursor-pointer"
          onClick={toggleView}
        >
          {viewMode === "grid" ? <MdViewList /> : <HiViewGrid />}
        </div>
      </div>
    </div>
  );
};

export default File_Expolor;
