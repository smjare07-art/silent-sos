import axios from "axios";

const api = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "http://localhost:5000/api",

  headers: {
    "Content-Type":
      "application/json",
  },

  withCredentials: true,

  timeout: 15000,
});

api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (
      error.response?.status ===
      401
    ) {
      const code =
        error.response?.data
          ?.code;

      if (
        code ===
          "TOKEN_EXPIRED" ||
        code ===
          "INVALID_TOKEN"
      ) {
        const path =
          window.location.pathname;

        if (
          path !== "/login" &&
          path !== "/register"
        ) {
          window.location.replace(
            "/login?session=expired"
          );
        }
      }
    }

    return Promise.reject(
      error
    );
  }
);

export default api;