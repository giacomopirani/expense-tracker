"use client";

import { motion } from "framer-motion";
import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/userContext";
import { SIDE_MENU_DATA } from "../../utils/data";
import CharAvatar from "../cards/charAvatar";

const menuVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.3,
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0 },
};

const SideMenu = ({ activeMenu }) => {
  const { user, clearUser } = useContext(UserContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const navigate = useNavigate();

  const handleClick = (route) => {
    if (route === "/logout") {
      handleLogout();
    } else {
      navigate(route);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    localStorage.removeItem("token");
    clearUser();
    // Small delay for better UX feedback
    setTimeout(() => {
      navigate("/login", { replace: true });
    }, 300);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={menuVariants}
      className="w-64 h-[calc(100vh-61px)] bg-white border-r border-gray-300/50 p-5 sticky top-[61px] z-20"
    >
      <motion.div
        variants={itemVariants}
        className="flex flex-col items-center justify-center gap-3 mt-3 mb-7"
      >
        <div className="relative group">
          {user?.profileImageUrl ? (
            <img
              src={user?.profileImageUrl || ""}
              alt="Profile Image"
              className="w-20 h-20 bg-stone-400 rounded-full shadow-md transition-shadow duration-300 group-hover:shadow-lg"
            />
          ) : (
            <div className="shadow-md transition-shadow duration-300 group-hover:shadow-lg rounded-full">
              <CharAvatar
                fullName={user?.fullName}
                width="w-20"
                height="h-20"
                style="text-xl"
              />
            </div>
          )}
        </div>

        <h5 className="text-stone-900 font-medium leading-6">
          {user?.fullName || ""}
        </h5>
      </motion.div>

      <div className="flex flex-col gap-2">
        {SIDE_MENU_DATA.map((item, index) => {
          const isActive = activeMenu === item.label;
          const isLogout = item.path === "/logout";

          return (
            <motion.div
              key={`menu_${index}`}
              variants={itemVariants}
              className={
                isLogout ? "mt-auto pt-4 border-t border-gray-200" : ""
              }
            >
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`w-full flex items-center gap-4 text-[15px] relative overflow-hidden ${
                  isActive
                    ? "text-white bg-primary shadow-md"
                    : "text-stone-600 hover:bg-gray-50"
                } py-3 px-6 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={() => handleClick(item.path)}
                aria-current={isActive ? "page" : undefined}
                aria-label={`${item.label}${isActive ? " (current page)" : ""}`}
                disabled={isLogout && isLoggingOut}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}

                <motion.div
                  whileHover={{ rotate: isLogout ? 0 : 5, scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <item.icon className="text-xl" />
                </motion.div>

                <span className="font-medium">{item.label}</span>

                {isLogout && isLoggingOut && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="ml-auto"
                  >
                    <svg
                      className="animate-spin h-4 w-4 text-current"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                  </motion.div>
                )}
              </motion.button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

export default SideMenu;
