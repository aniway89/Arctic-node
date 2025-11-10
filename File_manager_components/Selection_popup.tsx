import { IoIosCloseCircle } from "react-icons/io"
import { MdCheckBoxOutlineBlank, MdOutlineCheckBoxOutlineBlank } from "react-icons/md"

const Selection_popup = () => {
  return (
    <div className="selection_pop">
        <div className="container_popup bg sh-m ">

        <div className="popup_section bg-l sh-l">
            <div className="hader-pop ">
              <div className="close"></div>
              <div className="containres flex-col">
                <div className="close lefthang  flex">
                      <IoIosCloseCircle />
                </div>
                <div className="selected-items flex items-center justify-center">
                  <div className="Selected  flex items-center ">
                  <MdCheckBoxOutlineBlank
                  className="Checkbox" />
                    Selected items (123)
                  </div>
                  <div className="files_buttons flex gap-3">
                    <div className="files_but sh-m p-2 dime-blue">
                      Move
                    </div>
                    <div className="files_but sh-m p-2 ">
                      Archive
                    </div>
                    <div className="files_but sh-m p-2 dime-red">
                      Delete
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