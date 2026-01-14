import axios from "axios";

const api = axios.create({
  baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
});

export const getCampers = (params = {}) => {
  const { page, limit, ...rest } = params;

  return api.get("/campers", {
    params: {
      p: page,
      l: limit,
      ...rest,
    },
  });
};

export const getCamperById = (id) => api.get(`/campers/${id}`);
