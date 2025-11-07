import { FaFileAlt } from "react-icons/fa";
import Files_Tab from "./Files_Tab";
import { FaFileZipper } from "react-icons/fa6";

const File_Manager = () => {
  return (
    <div className="File_manager_container bg sh-s flex-col">
      <div className="wrapss flex-col pr-2 text-xs">
        <Files_Tab name="World" />   {/*for folder */}
        <Files_Tab name="server.properties" icon={FaFileAlt} /> {/*for File */}
        <Files_Tab name="server.properties" icon={FaFileZipper} /> {/*for For zip*/}
      </div>
    </div>
  );
};

export default File_Manager;
