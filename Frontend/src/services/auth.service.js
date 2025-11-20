import axios from "axios";

export const authExchange = async (url, sessionId) => {
  try {
    const response = await axios.post(url, sessionId);
    const data = await response.data;
    // console.log("User token and session data", data);
    sessionStorage.setItem("access_token", data.access);
  } catch (error) {
    console.error("Error in Getting access token", error);
    throw error;
  }
};

// creating a function to get data from the API
export const fetchAuthData = async (url, config = {}) => {
  try {
    const response = await axios.get(url, config);
    const data = await response.data;
    // console.log(data);
    // send only the active data
    return data;
  } catch (error) {
    console.error("Error while getting data", error);
    throw error;
  }
};
