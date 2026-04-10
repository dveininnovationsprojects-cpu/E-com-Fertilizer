import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api', // Unga backend URL inga mattum iruntha pothum
    withCredentials: true, // Cookies (JWT) auto-va send aagurathuku ithu compulsory
});

export default API;



