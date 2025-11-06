import File_Manager from "@/components/File_Manager";
import Hader from "@/components/Hader";
import Resource from "@/components/Resource";
import Terminal from "@/components/Terminal";

const page = () => {
  return (
    <main>
      <Hader />
      <div className="b-container flex gap-3 mt-3">
        <Terminal />
        <Resource />
        <File_Manager />
      </div>
    </main>
  );
};

export default page;
