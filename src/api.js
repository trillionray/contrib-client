import axios from "axios";

// to include the server url in every api request
const api = axios.create({
    baseURL: import.meta.env.VITE_API,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    console.log(token)
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});


export default api;