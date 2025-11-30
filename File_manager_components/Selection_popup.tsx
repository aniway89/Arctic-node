import { IoIosCloseCircle } from "react-icons/io"
import { MdCheckBoxOutlineBlank, MdOutlineCheckBox } from "react-icons/md"
import { useState, useEffect } from "react"

interface SelectionPopupProps {
  selectedCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  onMove: () => void;
  onArchive: () => void;
  onDelete: () => void;
  isAllSelected: boolean;
  isSelectionMode: boolean;
  archiving?: boolean;
  deleting?: boolean;
  moving?: boolean; // Add moving prop
}

const Selection_popup: React.FC<SelectionPopupProps> = ({
  selectedCount,
  onSelectAll,
  onClearSelection,
  onMove,
  onArchive,
  onDelete,
  isAllSelected,
  isSelectionMode,
  archiving = false,
  deleting = false,
  moving = false // Add moving prop
}) => {
  const [closing, setClosing] = useState(false);

  // Check if buttons should be disabled
  const isDisabled = selectedCount === 0;

  // Handle close animation
  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      onClearSelection();
    }, 300);
  };

  // Reset closing state when selection mode changes
  useEffect(() => {
    if (isSelectionMode) {
      setClosing(false);
    }
  }, [isSelectionMode]);

  // Handle button clicks with disabled check
  const handleMoveClick = () => {
    if (!isDisabled && !moving) {
      onMove();
    }
  };

  const handleArchiveClick = () => {
    if (!isDisabled && !archiving) {
      onArchive();
    }
  };

  const handleDeleteClick = () => {
    if (!isDisabled && !deleting) {
      onDelete();
    }
  };

  if (!isSelectionMode) return null;

  return (
    <div className={`selection_pop ${closing ? "closing" : "popup"}`}>
      <div className="container_popup bg sh-m">
        <div className="popup_section bg-l sh-l">
          <div className="hader-pop">
            <div className="containres flex-col">
              <div className="close lefthang flex cursor-pointer" onClick={handleClose}>
                <IoIosCloseCircle />
              </div>
              <div className="selected-items flex items-center justify-center">
                <div className="Selected flex items-center gap-2 cursor-pointer">
                  <div className="checkbox-cont flex items-center" onClick={onSelectAll}>
                    {isAllSelected ? (
                      <MdOutlineCheckBox className="Checkbox" />
                    ) : (
                      <MdCheckBoxOutlineBlank className="Checkbox" />
                    )}
                  </div>
                  Selected items ({selectedCount})
                </div>
                <div className="files_buttons flex gap-3">
                  <div 
                    className={`files_but sh-m p-2 dime-blue ${isDisabled || moving ? 'disabled' : 'cursor-pointer'}`}
                    onClick={handleMoveClick}
                  >
                    {moving ? 'Moving...' : 'Move'}
                  </div>
                  <div 
                    className={`files_but sh-m p-2 ${isDisabled || archiving ? 'disabled' : 'cursor-pointer'}`}
                    onClick={handleArchiveClick}
                  >
                    {archiving ? 'Archiving...' : 'Archive'}
                  </div>
                  <div 
                    className={`files_but sh-m p-2 dime-red ${isDisabled || deleting ? 'disabled' : 'cursor-pointer'}`}
                    onClick={handleDeleteClick}
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Selection_popup