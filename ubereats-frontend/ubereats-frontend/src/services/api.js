import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:2000/api',
    withCredentials: true, // For session-based auth
});

export default API;
