import React, { createContext, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

// create custom hook to use in later state access
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [sessionExpire, setSessionExpire] = useState(null);
  const [sessionId, setSessionId] = useState(null);
  const [loginUserData, setLoginUserData] = useState(null);
  const [lastActivity, setLastActivity] = useState(Date.now());

  const resetIdleTimer = () => setLastActivity(Date.now());

  const navigate = useNavigate();
  // Login function
  const loginData = (sessionIdValue, accessToken, userData) => {
    const data = {
      sessionId: sessionIdValue,
      token: accessToken,
      user: userData,
    };
    setLoginUserData(data);
    sessionStorage.setItem("access_token", accessToken);
    sessionStorage.setItem("session_id", sessionIdValue);
    sessionStorage.setItem("user", JSON.stringify(userData));
  };

  React.useEffect(() => {
    const events = ["mousemove", "keydown", "mousedown", "touchstart"];
    events.forEach((event) => window.addEventListener(event, resetIdleTimer));
    return () => {
      events.forEach((event) =>
        window.removeEventListener(event, resetIdleTimer)
      );
    };
  }, []);

  React.useEffect(() => {
    if (!loginUserData) return; // Only run if logged in

    const checkIdle = () => {
      const idleLimit = 15 * 60 * 1000; // 15 minutes
      if (Date.now() - lastActivity > idleLimit) {
        alert("You have been logged out due to inactivity.");
        logout();
      }
    };
    const interval = setInterval(checkIdle, 60 * 1000); // check every minute
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastActivity, loginUserData]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setSessionId(null);
    setSessionExpire(null);
    setLoginUserData(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("access_token");
    sessionStorage.removeItem("session_id");

    // Clear session and local storage
    sessionStorage.clear();
    // localStorage.clear();
    localStorage.removeItem("firstSchemeDefined");
    // localStorage.removeItem("changedRowIds");

    // Delete all cookies
    document.cookie.split(";").forEach((cookie) => {
      const name = cookie.split("=")[0].trim();
      document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
    });
    navigate("/", { replace: true });
  };

  // restore session on page reload keep loginUser Data hydrated to keep stable login details
  React.useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("access_token");
    const storedSessionId = sessionStorage.getItem("session_id");

    if (storedUser && storedToken && storedSessionId) {
      const userParsed = JSON.parse(storedUser);
      setUser(userParsed);
      setToken(storedToken);
      setSessionId(storedSessionId);
      setLoginUserData({
        user: userParsed,
        token: storedToken,
        sessionId: storedSessionId,
      });
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        loginUserData,
        user,
        token,
        sessionId,
        loginData,
        logout,
        sessionExpire,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
