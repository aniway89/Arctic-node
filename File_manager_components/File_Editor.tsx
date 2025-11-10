"use client";
import { useState } from "react";
import { IoIosCloseCircle } from "react-icons/io";

interface FileEditorProps {
  setIsVisible: (value: boolean) => void;
}

const File_Editor: React.FC<FileEditorProps> = ({ setIsVisible }) => {
  const [closing, setClosing] = useState(false);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => setIsVisible(false), 300);
  };

  return (
    <div className={`File_Editor bg-d flex bg-d sh-l ${closing ? "closing" : "popup"}`}>
      <div className="hader flex bg sh-l justify-between items-center text-c">
        File Editor
        <div className="close flex items-center cursor-pointer" onClick={handleClose}>
          <IoIosCloseCircle />
        </div>
      </div>

      <div className="file_editor_container bg sh-m">
        <div className="path">Home/</div>
        <div className="editor wrapss bg-d ">
          <div className="editor_line flex ">
            <div className="line_number bg-o">1</div>
            <div className="content">Div</div>
          </div>
          <div className="editor_line flex ">
            <div className="line_number bg-o">2</div>
            <div className="content">Div</div>
          </div>
        </div>
      </div>

      <div className="floatoing_buttons flex file_editor_f_buttons">
        <div className="cancel_button f_buttoons bg-d sh-l">Cancel</div>
        <div className="save_button f_buttoons bg-l sh-m">Save</div>
      </div>
    </div>
  );
};

export default File_Editor;
