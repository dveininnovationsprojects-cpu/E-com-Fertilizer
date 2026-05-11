import axios from 'axios';

const API = axios.create({
    baseURL: "https://saralx-backend.onrender.com/api",
    withCredentials: true, 
});

export default API;