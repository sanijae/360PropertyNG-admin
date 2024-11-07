import axios from 'axios';
// https://three60propertyapi.onrender.com
export const imageURL = 'https://three60propertyapi.onrender.com/api/property/images'
export const adminImageURL = 'https://three60propertyapi.onrender.com/api/property/admins'
export const agentImageURL = 'https://three60propertyapi.onrender.com/api/property/users'
export const licenseImageURL = 'https://three60propertyapi.onrender.com/api/property/license'

// http://localhost:5000/api
const api = axios.create({
  baseURL: 'https://three60propertyapi.onrender.com/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
// https://three60propertyapi.onrender.com/api/Admin/send-reset-link
export const resetPassword=(data:any) =>  api.put('/admin/resetPassword',data)
export const sendResetLink=(data:any) =>  api.post('/admin/send-reset-link',data)
export const resetPasswordVerification=(token:any) =>  api.post('/admin/reset-password-verification/'+token)

export default api;
