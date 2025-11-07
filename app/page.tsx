"use client";
import { useState } from "react";
import File_Manager from "@/components/File_Manager";
import Hader from "@/components/Hader";
import Resource from "@/components/Resource";
import Terminal from "@/components/Terminal";
import File_Editor from "@/File_manager_components/File_Editor";
import File_Expolor from "@/File_manager_components/File_Expolor";

const Page = () => {
  const [isFileEditorVisible, setFileEditorVisible] = useState<boolean>(true);
  const [isFileExpolorVisible, setFileExpolorVisible] = useState<boolean>(true);

  const absoluteContainerVisible = isFileEditorVisible || isFileExpolorVisible ? "flex" : "hidden";

 return (
    <main>
      <Hader />
      <div className="b-container flex gap-3 mt-3">
        <Terminal />
        <Resource />
        <File_Manager />
      </div>

      { (isFileEditorVisible || isFileExpolorVisible) && (
        <div className="absolute_container flex">
          {isFileExpolorVisible && (
            <File_Expolor setIsVisible={setFileExpolorVisible} />
          )}
          {isFileEditorVisible && (
            <File_Editor setIsVisible={setFileEditorVisible} />
          )}
        </div>
      )}
    </main>
  );
};

export default Page;
