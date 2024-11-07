import axios from 'axios';

export const imageURL = 'http://localhost:5000/Property/images'
export const adminImageURL = 'http://localhost:5000/Property/admins'
export const agentImageURL = 'http://localhost:5000/Property/users'
export const licenseImageURL = 'http://localhost:5000/Property/license'

const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});
// http://localhost:5000/Admin/send-reset-link
export const resetPassword=(data:any) =>  api.put('/Admin/resetPassword',data)
export const sendResetLink=(data:any) =>  api.post('/Admin/send-reset-link',data)
export const resetPasswordVerification=(token:any) =>  api.post('/Admin/reset-password-verification/'+token)

export default api;
