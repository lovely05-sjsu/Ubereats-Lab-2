import axios from 'axios';

const API = axios.create({
    baseURL: '/api',
    withCredentials: true, // For session-based auth
});

export default API;
