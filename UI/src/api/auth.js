import axiosClient from "./axios";

export const loginApi = (username, password) => {
  return axiosClient.post(`/auth/login`, {
    username,
    password,
  });
};

export const registerApi = (username, password, fullname) => {
  return axiosClient.post(`/auth/register`, {
    username,
    password,
    fullname,
  });
};

export const meApi = () => axiosClient.get("/auth/me");
