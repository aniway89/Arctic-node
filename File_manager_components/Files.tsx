import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md";
import { useRef } from "react";

interface FilesProps {
  title: string;
  time: string;
  icon?: React.ReactNode;
  viewMode: "grid" | "list";
  isFolder?: boolean;
  onClick: () => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
  onSelect: (selected: boolean) => void;
  onLongPress: (fileName: string) => void; // Now receives fileName
}

const Files: React.FC<FilesProps> = ({ 
  title, 
  time, 
  icon, 
  viewMode, 
  isFolder = false, 
  onClick,
  isSelected = false,
  isSelectionMode = false,
  onSelect,
  onLongPress
}) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  const startLongPress = () => {
    console.log("Long press started on:", title); // Debug log
    longPressTimer.current = setTimeout(() => {
      console.log("Long press completed on:", title); // Debug log
      // After 2 seconds: Activate selection mode AND select this file
      onLongPress(title); // Pass the fileName to parent
    }, 600);
  };

  const endLongPress = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // If we're in selection mode, toggle selection
    if (isSelectionMode) {
      onSelect(!isSelected);
    } else {
      // Normal mode - handle click normally
      onClick();
    }
  };

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(!isSelected);
  };

  return (
    <div 
      className={`File_card bg-l sh-l ${viewMode} ${isFolder ? 'folder' : 'file'} cursor-pointer ${isSelected ? 'selected-file' : ''}`}
      onClick={handleClick}
      onMouseDown={startLongPress}
      onMouseUp={endLongPress}
      onMouseLeave={endLongPress}
      onTouchStart={startLongPress}
      onTouchEnd={endLongPress}
    >
      <div className="right">
        {/* Show checkbox only in selection mode */}
        {isSelectionMode && (
          <div className="checkbox-container" onClick={handleCheckboxClick}>
            {isSelected ? (
              <MdOutlineCheckBox className="checkbox-icon selected" />
            ) : (
              <MdCheckBoxOutlineBlank className="checkbox-icon" />
            )}
          </div>
        )}
        {icon}
        <div className="file_title">{title}</div>
      </div>
      <div className="recent-update">{time}</div>
    </div>
  );
};

export default Files;