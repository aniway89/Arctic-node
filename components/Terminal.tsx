import React from "react";
import { MdTerminal } from "react-icons/md";

const Terminal = () => {
  return (
    <div className="Terminal bg sh-s ">
      <div className="terminal sh-l bg-l overflow-hidden">
        <div className="log overflow-y-scroll font-semibold ">
          <div className="terminal_line flex items-center warp text-wrap text-sm">
            container@pterodactyl~ Server marked as running...
          </div>
          <div className="terminal_line flex items-center warp text-wrap text-sm">
            [17:04:30 INFO]: Sensai_Dragon[/110.235.239.151:28050] logged in with entity id 11322 at ([lobby]0.5189497924407845, 70.0, 0.473251209588854)
          </div>
        </div>
        <div className="commands flex items-center bg p-2">
          <MdTerminal className="text-2xl" />
          <input
            type="text"
            placeholder="Type minecraft command here /"
            className="w-full pl-3 outline-0 "
          />
        </div>
      </div>
    </div>
  );
};

export default Terminal;
