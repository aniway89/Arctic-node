import { FaFolder } from "react-icons/fa";

const Files_Tab = ({
  name = "File 1",
  icon: Icon = FaFolder,
  iconSize = "text-3xl",
  className = "",
}) => {
  return (
    <div className={`Fiels bg-l sh-s flex items-center gap-4 ${className}`}>
      <Icon className={iconSize} />
      {name}
    </div>
  );
};

export default Files_Tab;
