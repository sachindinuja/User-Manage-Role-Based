import React, { useEffect } from "react";
import { CircleArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authExchange, fetchAuthData } from "./services/auth.service";
import { useAuth } from "./context/Auth.context";
import Loader from "./components/common/Loader";

const WaitingPage = () => {
  const VITE_AUTH_EXCHANGE_URL = import.meta.env.VITE_AUTH_EXCHANGE_URL;
  const VITE_AZURE_LOGIN_URL = import.meta.env.VITE_AZURE_LOGIN_URL;
  const VITE_LOGGED_USER_PROFILE_URL = import.meta.env
    .VITE_LOGGED_USER_PROFILE_URL;
  const navigate = useNavigate();
  const { loginData } = useAuth(); // get login from context

  useEffect(() => {
    const sessionParameter = new URLSearchParams(window.location.search).get(
      "session"
    );
    const session = { session_id: sessionParameter };

    async function fetchToken() {
      if (sessionParameter) {
        sessionStorage.setItem("session_id", sessionParameter);

        await authExchange(VITE_AUTH_EXCHANGE_URL, session);
        const accessToken = sessionStorage.getItem("access_token");

        // fetch login user data
        const response = await fetchAuthData(VITE_LOGGED_USER_PROFILE_URL, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        const userData = await response;
        loginData(sessionParameter, accessToken, userData); // store in context

        // If profile is complete, redirect to dashboard (or role-based page)
        if (userData && userData.profile_complete) {
          if (userData.user_role === "Regional General Manager") {
            navigate("/salesincentive/analytics", { replace: true });
          }
          if (userData.user_role === "Chief Officer Finance") {
            navigate("/cfo-dashboard", { replace: true });
          }
          if (userData.user_role === "Manager Dealer Management") {
            navigate("/dealer/analytics", { replace: true });
          }
        }
        // If profile is not complete, stay on lobby/waiting page
      }
    }

    fetchToken();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [VITE_AUTH_EXCHANGE_URL, navigate, loginData]);

  return (
    <div className="flex flex-col items-center justify-center h-screen background-img3">
      <Loader />
      <div className="flex flex-col justify-center text-center">
        <h1 className="text-2xl font-bold text-center text-white">
          Processing...
        </h1>
        <p className="mt-1 text-white">
          This may take few hours to process your request.
        </p>
        <a
          href={VITE_AZURE_LOGIN_URL}
          className="flex items-center justify-center gap-2 px-4 py-2 mt-10 text-white bg-green-600 rounded hover:bg-green-700"
        >
          Refresh Login
        </a>
        <button
          onClick={() => navigate("/")}
          className="flex items-center justify-center gap-2 px-4 py-2 mt-10 text-white bg-blue-600 rounded hover:bg-blue-700"
        >
          <CircleArrowLeft />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default WaitingPage;
WaitingPage;
