import axios from "axios";

const api = axios.create({
  baseURL: "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io",
  timeout: 10000,
});

export const getCampers = ({ page = 1, limit = 4, location, form, transmission, AC, kitchen, TV, bathroom } = {}) => {
  const params = { page, limit };
  
  if (location) params.location = location;
  if (form) params.form = form;
  if (transmission) params.transmission = transmission;
  
  if (AC) params.AC = true;
  if (kitchen) params.kitchen = true;
  if (TV) params.TV = true;
  if (bathroom) params.bathroom = true;
  
  console.log("API'ye gönderilen parametreler:", params);
  
  return api.get("/campers", { params });
};

export const getCamperById = (id) => api.get(`/campers/${id}`);