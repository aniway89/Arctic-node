"use client";
import { useState, useEffect } from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface FileEditorProps {
  setIsVisible: (value: boolean) => void;
  filePath?: string;
  fileName?: string;
}

const File_Editor: React.FC<FileEditorProps> = ({ setIsVisible, filePath, fileName }) => {
  const [closing, setClosing] = useState(false);
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch file content when component mounts or filePath changes
  useEffect(() => {
    if (filePath) {
      fetchFileContent(filePath);
    } else {
      setLoading(false);
      setContent("// Welcome to File Editor\n// Open a file to start editing");
    }
  }, [filePath]);

  const fetchFileContent = async (path: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/files/content?path=${encodeURIComponent(path)}`);
      const data = await res.json();
      setContent(data.content || "");
    } catch (err) {
      console.error("Error fetching file content:", err);
      setContent("// Error loading file content");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!filePath) return;
    
    try {
      await fetch('/api/files/content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          path: filePath,
          content: content
        }),
      });
      console.log("File saved successfully");
    } catch (err) {
      console.error("Error saving file:", err);
    }
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
  };

  return (
    <div className={`File_Editor bg-d flex bg-d sh-l ${closing ? "closing" : "popup"}`}>
      <div className="hader flex bg sh-l justify-between items-center text-c">
        File Editor - {fileName || "Untitled"}
        <div className="close flex items-center cursor-pointer" onClick={handleClose}>
          <IoIosCloseCircle />
        </div>
      </div>

      <div className="file_editor_container bg sh-m">
        <div className="path">Path: {filePath || "No file selected"}</div>
        <div className="editor wrapss bg-d">
          {loading ? (
            <div className="text-c p-3">Loading file content...</div>
          ) : (
            <textarea
              value={content}
              onChange={handleContentChange}
              className="w-full h-full bg-d text-c p-4 font-mono resize-none border-none outline-none"
              style={{ minHeight: '400px' }}
            />
          )}
        </div>
      </div>

      <div className="floatoing_buttons flex file_editor_f_buttons">
        <div className="cancel_button f_buttoons bg-d sh-l" onClick={handleClose}>
          Cancel
        </div>
        <div className="save_button f_buttoons bg-l sh-m" onClick={handleSave}>
          Save
        </div>
      </div>
    </div>
  );
};

export default File_Editor;