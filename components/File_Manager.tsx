import { FaFileAlt } from "react-icons/fa";
import Files_Tab from "./Files_Tab";

const File_Manager = () => {
  return (
    <div className="File_manager_container bg sh-s flex-col">
      <div className="wrapss flex-col pr-2 text-xs">
        <Files_Tab name="World" />
        <Files_Tab name="Overworld" />
        <Files_Tab name="Nether" />
        <Files_Tab name="Server" />
        <Files_Tab name="Plugins" />
        <Files_Tab name="Connfig" />
        <Files_Tab name="cahch" />
        <Files_Tab name="server.properties" icon={FaFileAlt} />
        <Files_Tab name="Config.json" icon={FaFileAlt} />
        <Files_Tab name="world.list" icon={FaFileAlt} />
        <Files_Tab name="Whitelist" icon={FaFileAlt} />
      </div>
    </div>
  );
};

export default File_Manager;
