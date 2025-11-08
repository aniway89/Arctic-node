// File_manager_components/Files.tsx
interface FilesProps {
  title: string;
  time: string;
  icon?: React.ReactNode;
  viewMode: "grid" | "list";
  isFolder?: boolean;
}

const Files: React.FC<FilesProps> = ({ title, time, icon, viewMode, isFolder = false }) => {
  return (
    <div className={`File_card bg-l sh-l ${viewMode} ${isFolder ? 'folder' : 'file'}`}>
      <div className="right">
        {icon}
        <div className="file_title">{title}</div>
      </div>
      <div className="recent-update">{time}</div>
    </div>
  );
};

export default Files;