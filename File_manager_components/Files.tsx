import { FaFolder } from "react-icons/fa";

interface FilesProps {
  title: string;
  time: string;
  icon?: React.ReactNode;
  viewMode: "grid" | "list";
}

const Files: React.FC<FilesProps> = ({ title, time, icon, viewMode }) => {
  return (
    <div className={`File_card bg-l sh-l ${viewMode}`}>
      <div className="right">
        {icon || <FaFolder className="text-3xl" />}
        <div className="file_title">{title}</div>
      </div>
      <div className="recent-update">{time}</div>
    </div>
  );
};

export default Files;
