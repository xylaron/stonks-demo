import { BiSearch, BiBriefcase } from "react-icons/bi";

const Footer: React.FC = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 z-50 bg-neutral-800 py-3">
      <div className="container mx-auto flex items-center justify-evenly gap-16 text-sm font-semibold">
        <div className="flex flex-col items-center">
          <BiSearch size={16} />
          <p className="">Search</p>
        </div>
        <div className="flex flex-col items-center">
          <BiBriefcase size={16} />
          <p className="">Portfolio</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
