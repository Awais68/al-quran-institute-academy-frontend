const devURL = "http://localhost:4000";
const prodURL = "https://al-quran-institute-online-backend.onrender.com";

export const BASE_URL = prodURL;

export const AppRoutes = {
  signup: BASE_URL + "/auth/signup",
  login: BASE_URL + "/auth/login",

  getStudent: BASE_URL + "/user/getUser",
  addStudent: BASE_URL + "/student",
  uploadImage: BASE_URL + "/upload",
  contact: BASE_URL + "/contactForms",
  getAStudent: (id) => `${BASE_URL}/studentById/getAStudent/${id}`,
  getCurrentUser: BASE_URL + `/getCurrentUser`,
  getAllStudents: BASE_URL + `/getAllStudents`,
};
// src/constants/api.js
