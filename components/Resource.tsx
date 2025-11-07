import { RiCpuLine, RiRam2Fill } from "react-icons/ri";
import { FaWifi } from "react-icons/fa";
import { GoClockFill } from "react-icons/go";
import { PiHardDrivesFill } from "react-icons/pi";

const Resource = () => {
  return (
    <div className="resources  ">
      <div className="Reasource_Card  bg-l p-4 sh-m ">
        <FaWifi className="text-3xl" />
        <div className="by  font-semibold text-xs text-center mt-2">
          orcarmmub2.arcticverse.in port: 1031
        </div>
      </div>
      <div className="Reasource_Card  bg-l p-4 sh-m ">
        <GoClockFill className="text-3xl" />
        <div className="by font-semibold text-1xl text-center mt-2">
          4D 12H 14M
        </div>
      </div>
      <div className="Reasource_Card  bg-l p-4 sh-m ">
        <RiRam2Fill className="text-3xl" />
        <div className="by font-semibold text-1xl text-center mt-2">
          4.4 / 12Gb
        </div>
      </div>
      <div className="Reasource_Card  bg-l p-4 sh-m ">
        <RiCpuLine className="text-3xl" />
        <div className="by font-semibold text-1xl text-center mt-2">
          100 / 129%
        </div>
      </div>
      <div className="Reasource_Card  bg-l p-4 sh-m ">
        <PiHardDrivesFill className="text-3xl" />
        <div className="by font-semibold text-1xl text-center">4.4 / 19Gb</div>
      </div>
    </div>
  );
};

export default Resource;
