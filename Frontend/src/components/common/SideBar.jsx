import React, { useState } from "react";
import { useAuth } from "../../context/Auth.context";
import { useNavigate } from "react-router-dom"; //new

function SideBar({ sidebarData }) {
  // Accept sidebarData as prop
  const [activeLink, setActiveLink] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const { loginUserData } = useAuth();
  const navigate = useNavigate();
  const handleLinkClick = (index) => {
    setActiveLink((prev) => (prev === index ? null : index));
  };

  const handleMouseEnter = () => {
    setIsSidebarExpanded(true);
  };

  const handleMouseLeave = () => {
    setIsSidebarExpanded(false);
  };

  const userInfo = {
    username: loginUserData.user?.name,
    serviceId: loginUserData.user?.service_id,
    designation: loginUserData.user?.designation,
  };

  return (
    <div
      className={`flex flex-col h-auto mt-30 text-white bg-black/30 border-r-blue-300  transition-all duration-300 ${
        isSidebarExpanded ? "w-96 p-4 rounded-2xl" : "w-16 rounded-lg"
      }`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* profile card */}
      <div
        className={`flex items-center space-x-5 mb-4 bg-gradient-to-r from-secondary to-success rounded-lg p-2 shadow-2xl ${
          isSidebarExpanded ? "flex-row" : "flex-col items-center"
        }`}
      >
        <img
          src="https://www.slt.lk/sites/default/files/images/products%20related/internet_lp_bottom_slt_4G_large.jpg"
          alt="Logo"
          className="w-12 h-12 rounded-full"
        />
        {isSidebarExpanded && (
          <div className="block">
            <h1 className="font-bold text-md">{userInfo.username}</h1>
            <p className="text-sm">{userInfo.serviceId}</p>
            <p className="text-[12px]">{userInfo.designation}</p>
          </div>
        )}
      </div>

      {/* navigations */}
      <ul className="px-3 py-5 space-y-5">
        {sidebarData.map((item, index) => {
          const isActive = activeLink === index;
          return (
            <li key={index}>
              <div
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer ${
                  isActive
                    ? "bg-success"
                    : "hover:border-l-8 hover:border-l-success"
                }`}
                onClick={() => handleLinkClick(index)}
              >
                {typeof item.icon === "string" ? (
                  <img src={item.icon} alt={item.title} className="w-6 h-6" />
                ) : (
                  <item.icon className="w-6 h-6" />
                )}
                {isSidebarExpanded && (
                  <a onClick={() => navigate(item.href, { replace: true })} //new
                   className="flex-1">
                    <p className="font-semibold text-xl">{item.title}</p>
                  </a>
                )}
              </div>
              {item.sublinks && item.sublinks.length > 0 && (
                <ul
                  className={`${isActive ? "block" : "hidden"} pl-4 space-y-2`}
                >
                  {item.sublinks.map((link) => (
                    <a onClick={() => navigate(link.href, { replace: true })} key={link.title}> 
                      <li
                        className={`px-2 hover:bg-gradient-to-r from-secondary to-success rounded-md ${
                          isSidebarExpanded ? "text-lg" : "hidden"
                        }`}
                      >
                        {link.title}
                      </li>
                    </a>
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default SideBar;
