import axiosClient from "./axios";

export const loginApi = (username, password) => {
  return axiosClient.post(`/api/auth/login`, {
    username,
    password
  });
};

export const registerApi = (username, password) => {
  return axiosClient.post(`/api/auth/register`, { 
    username, 
    password
  });
};
