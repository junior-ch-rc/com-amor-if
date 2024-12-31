import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL;

export const fetchPrivateData = async (call, token, attributes) => {
  try {
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const url =
      `${API_URL}` + call + (attributes != undefined ? attributes : "");
    const response = await axios.get(url, {
      headers: header,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const postPrivateData = async (call, data, token) => {
  try {
    const header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    const url = `${API_URL}` + call;
    const response = await axios.post(url, data, {
      headers: header,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
