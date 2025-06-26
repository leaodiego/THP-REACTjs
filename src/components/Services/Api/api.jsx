import axios from 'axios';

const api = axios.create({
    baseURL : "https://localhost:7155",
})

export default api;