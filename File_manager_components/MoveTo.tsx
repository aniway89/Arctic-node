import { HiOutlineSearch } from "react-icons/hi"
import Move_File from "./Move_File"

const MoveTo = () => {
  return (
    <div className="Move  bg-d sh-l">
        <div className="move_path bg sh-l">
         Home/
        </div>
        <div className="file_contianer bg sh-m">
        <div className="holderofthe  wrapss">
            <Move_File/>
            <Move_File/>
            <Move_File/>
            <Move_File/>
            <Move_File/>
            <Move_File/>
            <Move_File/>
            <Move_File/>
        </div>
        </div>
        <div className="butns bg sh-l flex items-center">
            <div className="Select_folder Mbutton bg-l sh-m">Select folder</div>
            <div className="cancel_move   Mbutton sh-l">Cancle</div>
        </div>
    </div>
  )
}

export default MoveTo