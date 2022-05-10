import axois from 'axios';

const Apis = axois.create({
    baseURL: '/api', // cors => 'http://localhost:8080/api',
    headers: {
        'Content-Type': 'application/json'
    },
    withCredentials: true
});

export default Apis;
