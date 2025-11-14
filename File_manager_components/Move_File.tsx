import { FaFolder } from "react-icons/fa"

interface MoveFileProps {
  folderName: string;
  isSelected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const Move_File = ({ folderName, isSelected, onClick, onDoubleClick }: MoveFileProps) => {
  return (
    <div 
      className={`movefile flex items-center justify-between bg-l sh-m ${
        isSelected ? 'selectedMoveToFolder' : ''
      }`}
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="rightside">
        <FaFolder className="Foldericon"/> {folderName}
      </div>
    </div>
  )
}

export default Move_File