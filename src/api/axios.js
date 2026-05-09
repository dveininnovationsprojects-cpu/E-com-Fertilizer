import axios from 'axios';

const API = axios.create({
    baseURL: "https://saralx-backend.onrender.com/api", // Unga backend URL inga mattum iruntha pothum
    withCredentials: true, // Cookies (JWT) auto-va send aagurathuku ithu compulsory
});

export default API;