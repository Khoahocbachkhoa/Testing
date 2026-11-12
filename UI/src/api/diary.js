import axiosClient from "./axios";

export const getEntriesApi = () =>
  axiosClient.get("/diary-entries", { params: { page: 1, limit: 100 } });

export const createEntryApi = (entry) =>
  axiosClient.post("/diary-entries", entry);

export const updateEntryApi = (id, entry) =>
  axiosClient.put(`/diary-entries/${id}`, entry);

export const deleteEntryApi = (id) =>
  axiosClient.delete(`/diary-entries/${id}`);
