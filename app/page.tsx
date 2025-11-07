"use client";
import File_Manager from "@/components/File_Manager";
import Hader from "@/components/Hader";
import Resource from "@/components/Resource";
import Terminal from "@/components/Terminal";
import File_Expolor from "@/File_manager_components/File_Expolor";

const page = () => {
  return (
    <main>
      <Hader />
      <div className="b-container flex  gap-3 mt-3">
        <Terminal />
        <Resource />
        <File_Manager />
      </div>
      <File_Expolor/>
    </main>
  );
};

export default page;
