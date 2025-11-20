import React from "react";
import logo from "../../assets/images/logo.png";
import MicrosoftLogo from "../../assets/icons/microsoft.png";
import CustomBtn from "../sales-incentive/CustomBtn";
import CanvasCursor from "../sales-incentive/FluidCursor";
import bgvideo from "../../../src/assets/images/Blue Futuristic Artificial Intelligence Presentation.mp4";
import SplitText from "../common/SplitText";

function Signin() {
  // connecting to user authentication service
  const VITE_AZURE_LOGIN_URL = import.meta.env.VITE_AZURE_LOGIN_URL;

  return (
    <>
      {/* background video */}
      <video className="background-video" autoPlay loop muted playsInline>
        <source src={bgvideo} type="video/mp4" />
      </video>

      <div className="min-h-screen ">
        {/* use interaction for cursor effect */}
        <CanvasCursor />
        {/* header section with logo */}
        <header className="p-5 ">
          <img src={logo} alt="logo" className="w-auto h-25" />
        </header>

        {/* main content section */}
        <main className="flex w-full gap-2 text-center rounded-2xl">
          <div className="flex flex-col items-center justify-center w-full min-h-screen overflow-y-auto px-25">
            {/* <h1 className="p-5 text-6xl font-black text-white rounded-2xl ">
              <SplitText
                text="SALES INCENTIVE"
                className="text-8xl font-bold text-center"
                delay={200}
                duration={0.6}
                ease="power3.out"
                splitType="chars"
                from={{ opacity: 0, y: 40 }}
                to={{ opacity: 1, y: 0 }}
                threshold={0.1}
                rootMargin="-100px"
                textAlign="center"
              />
              <br />
              <span className="text-transparent bg-gradient-to-r from-primary to-orange bg-clip-text">
                AUTOMATION SYSTEM
              </span>
            </h1>
            <p className="mt-4 text-xl font-semibold text-white/20 ">
              Powerful dashboard solution for managing products, payments, and
              eligibility with advanced analytics and insights.
            </p> */}
            <a href={VITE_AZURE_LOGIN_URL}>
              <CustomBtn name={"Login Microsoft"} icon={MicrosoftLogo} />
            </a>
          </div>
        </main>
      </div>
    </>
  );
}

export default Signin;
