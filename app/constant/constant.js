const devURL = "http://localhost:4000";
const prodURL = "";

export const BASE_URL = devURL;

export const AppRoutes = {
  signup: BASE_URL + "/auth/signup",
  getStudent: BASE_URL + "/user/getUser",
  addStudent: BASE_URL + "student",
  uploadImage: BASE_URL + "/upload",
  contact: BASE_URL + "/contactForm",
  getAStudent: BASE_URL + `/studentById/getAStudent`,
  CURRENT_STUDENT_API: BASE_URL + `/currentStudent`,
};
// src/constants/api.js
