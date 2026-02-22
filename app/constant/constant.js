const devURL = process.env.NEXT_PUBLIC_API_DEV_URL || "http://localhost:4000";
const prodURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://al-quran-institute-online-backend.onrender.com";

export const BASE_URL = process.env.NODE_ENV === 'production' ? prodURL : devURL;
export const SOCKET_URL = process.env.NEXT_PUBLIC_SOCKET_URL || BASE_URL;

export const AppRoutes = {
  signup: BASE_URL + "/auth/signup",
  login: BASE_URL + "/auth/login",

  getStudent: BASE_URL + "/user/getUser",
  addStudent: BASE_URL + "/student",
  uploadImage: BASE_URL + "/upload",
  contact: BASE_URL + "/contactForms",
  getAStudent: (id) => `${BASE_URL}/studentById/getAStudent/${id}`,
  getCurrentUser: BASE_URL + `/getCurrentUser/getCurrentUser`,
  getAllStudents: BASE_URL + `/getAllStudents`,
};
// src/constants/api.js
