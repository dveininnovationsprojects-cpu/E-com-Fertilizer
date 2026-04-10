import axios from 'axios';

const API = axios.create({
    baseURL: 'http://192.168.1.6:5000/api', // Unga backend URL inga mattum iruntha pothum
    withCredentials: true, // Cookies (JWT) auto-va send aagurathuku ithu compulsory
});

export default API;



