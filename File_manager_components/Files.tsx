import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";

// File_manager_components/Files.tsx
interface FilesProps {
  title: string;
  time: string;
  icon?: React.ReactNode;
  viewMode: "grid" | "list";
  isFolder?: boolean;
  onClick: () => void;
}

const Files: React.FC<FilesProps> = ({ title, time, icon, viewMode, isFolder = false, onClick }) => {
  return (
    <div 
      className={`File_card bg-l sh-l ${viewMode} ${isFolder ? 'folder' : 'file'} cursor-pointer`}
      onClick={onClick}
    >
      <div className="right">
        <MdCheckBoxOutlineBlank />{/*display these both icons by default if the file is not selected*/}
        <MdOutlineCheckBox /> {/*IF selected */}
        {icon}
        <div className="file_title">{title}</div>
      </div>
      <div className="recent-update">{time}</div>
    </div>
  );
};

export default Files;