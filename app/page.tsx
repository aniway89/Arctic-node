// page.tsx
"use client";
import { useState } from "react";
import File_Manager from "@/components/File_Manager";
import Hader from "@/components/Hader";
import Resource from "@/components/Resource";
import Terminal from "@/components/Terminal";
import File_Editor from "@/File_manager_components/File_Editor";
import File_Expolor from "@/File_manager_components/File_Expolor";
import Selection_popup from "@/File_manager_components/Selection_popup";

const Page = () => {
  const [isFileEditorVisible, setFileEditorVisible] = useState<boolean>(false);
  const [isFileExpolorVisible, setFileExpolorVisible] = useState<boolean>(false);
  const [currentFile, setCurrentFile] = useState<{path: string, name: string} | null>(null);

  const handleFolderClick = (folderName: string) => {
    setFileExpolorVisible(true);
  };

  const handleFileClick = (fileName: string) => {
    // For files in the main File_Manager component
    setFileEditorVisible(true);
  };

  const handleFileOpen = (filePath: string, fileName: string) => {
    setCurrentFile({ path: filePath, name: fileName });
    setFileEditorVisible(true);
  };

  return (
    <main>
      <Hader />
      <div className="b-container flex gap-3 mt-3">
        <Terminal />
        <Resource />
        <File_Manager 
          onFolderClick={handleFolderClick}
          onFileClick={handleFileClick}
        />
      </div>

      { (isFileEditorVisible || isFileExpolorVisible) && (
        <div className="absolute_container flex">
          {isFileExpolorVisible && (
            <File_Expolor 
              setIsVisible={setFileExpolorVisible} 
              onFileOpen={handleFileOpen}
            />
          )}
          {isFileEditorVisible && (
            <File_Editor 
              setIsVisible={setFileEditorVisible} 
              filePath={currentFile?.path}
              fileName={currentFile?.name}
            />
          )}
        </div>
      )}
    </main>
  );
};

export default Page;