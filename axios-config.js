import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:8082", // Ajusta la URL base de tu backend
});

// Interceptor para agregar el token JWT en los encabezados
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default instance;
