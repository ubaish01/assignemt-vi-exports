import axios from "axios";
import { BACKEND_URL } from "./src/constant";

const AxiosInstance = axios.create({
  timeout: 5 * 60 * 1000, // 5 minutes
  baseURL: `${BACKEND_URL}/api/v1`,
});

export const getRequest = async (url) => {
  const token = localStorage.getItem("token");
  try {
    const res = await AxiosInstance({
      method: "get",
      url,
      ...(token && {
        headers: {
          Authorization: `${token}`,
        },
      }),
    });
    return res;
  } catch (error) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};

export const postRequest = async (url, data) => {
  const token = localStorage.getItem("token");

  try {
    return await AxiosInstance({
      method: "post",
      url,
      data: data,
      ...(token && {
        headers: {
          Authorization: `${token}`,
        },
      }),
    });
  } catch (error) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};

export const putRequest = async (url, data = {}) => {
  const token = localStorage.getItem("token");
  try {
    return await AxiosInstance({
      method: "put",
      url,
      data: data,
      ...(token && {
        headers: {
          Authorization: `${token}`,
        },
      }),
    });
  } catch (error) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};

export const deleteRequest = async (url, data = {}) => {
  const token = localStorage.getItem("token");
  try {
    return await AxiosInstance({
      method: "delete",
      url,
      data: data,
      ...(token && {
        headers: {
          Authorization: `${token}`,
        },
      }),
    });
  } catch (error) {
    let data = error.response && error.response.data;
    return { error: true, message: error.message, data: data };
  }
};
