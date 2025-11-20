import React, { useState, useEffect } from "react";
// import logo from "../../assets/images/logo.png";
import logo2 from "../../assets/images/incentive_logo.png";
import { LogOut } from "lucide-react";
import { useAuth } from "../../context/Auth.context";

function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const { logout } = useAuth();

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date()); // Update the time every second
    }, 1000);

    return () => clearInterval(timer); // Cleanup the interval on component unmount
  }, []);

  return (
    <div className="flex items-center justify-between p-5 bg-background rounded-bl-2xl rounded-br-2xl">
      {/* <img src={logo} alt="logo" className="w-auto h-10" /> */}
      <img src={logo2} alt="logo" className="w-auto h-10" />
      <div className="flex items-center px-10 space-x-5">
        <h2 className="text-gray-500">
          {currentTime.toDateString()} |{" "}
          <span className="font-bold text-primary">
            {currentTime.toLocaleTimeString()}
          </span>
        </h2>
        <img
          src="https://www.slt.lk/sites/default/files/images/products%20related/internet_lp_bottom_slt_4G_large.jpg"
          alt="Profile"
          className="w-auto border border-gray-300 rounded-full h-15"
        />
        <a
          className="p-2 transition-colors bg-red-500 rounded-full cursor-pointer hover:bg-gray-200"
          onClick={() => {
            // Your logout logic here
            logout();
          }}
        >
          <LogOut color="white" />
        </a>
      </div>
    </div>
  );
}

export default Header;
