import { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import Logo from "../../assets/img/logo.png";
import SideMenu from "./sidemenu";

const Navbar = ({ activeMenu }) => {
  const [opendSideMenu, setOpendSideMenu] = useState(false);

  return (
    <div className="flex gap-5 bg-white border border-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-30">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setOpendSideMenu(!opendSideMenu);
        }}
      >
        {opendSideMenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <img src={Logo} alt="Logo App" className="w-12 h-12 rounded-full" />

      {opendSideMenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activeMenu={activeMenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
