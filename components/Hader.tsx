"use client";

import { useEffect, useState } from "react";
import { BiSolidDashboard } from "react-icons/bi";
import { FaCloudMoon } from "react-icons/fa";
import { HiOutlineLogout} from "react-icons/hi";

const Hader = () => {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Detect system preference or localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
      if (savedTheme) {
        setTheme(savedTheme);
        document.body.classList.toggle("light", savedTheme === "light");
      } else {
        const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
        const defaultTheme = prefersLight ? "light" : "dark";
        setTheme(defaultTheme);
        document.body.classList.toggle("light", defaultTheme === "light");
      }
    }
  }, []);

  // Handle toggle click
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.body.classList.toggle("light", newTheme === "light");
    localStorage.setItem("theme", newTheme);
  };

  return (
    <div className="Hader flex justify-between p-4 items-center sh-l text-c bg">
      <div className="left text-2xl font-semibold">Arctic Nodes SMP</div>
      <div className="right flex gap-5 text-2xl items-center">

        <div className="Acton_buttons cursor-pointer">
          <BiSolidDashboard />
        </div>
        <div className="Acton_buttons cursor-pointer flex items-center w-8 h-8 overflow-hidden rounded-full ayan_khan">
          <img src="
          https://avatars.githubusercontent.com/u/135550864?s=48&v=4
          " alt="User" className="user_pfp" />
        </div>
        <div className="Acton_buttons cursor-pointer">
          <HiOutlineLogout />
        </div>
        <div className="Acton_buttons cursor-pointer pl-5" onClick={toggleTheme}>
          <FaCloudMoon />
        </div>
      </div>
    </div>
  );
};

export default Hader;
