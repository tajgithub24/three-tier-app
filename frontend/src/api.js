// import axios from 'axios';

// const API = axios.create({
//   baseURL: process.env.REACT_APP_BACKEND_URL
// });

// export default API;


// api.js
import axios from 'axios';
const API = axios.create({
  baseURL: '/api' // relative path -> server will proxy to backend
});
export default API;
