import axios from 'axios';

export const imageURL = 'http://localhost:5000/Property/images'
export const adminImageURL = 'http://localhost:5000/Property/admins'
export const agentImageURL = 'http://localhost:5000/Property/users'
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
