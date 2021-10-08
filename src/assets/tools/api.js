import axios from 'axios';
import { getAccessToken, authenticate } from './../../variables/accessToken';

const pathIgnoreAuth = [
  '/login',
  '/refresh'
]

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true
});

api.interceptors.request.use(async req => {
  const { url } = req;
  // Ignore sending authentication header for login and refresh actions
  if (pathIgnoreAuth.indexOf(url) < 0) {
    // When checking auth, set the Authorization as the token
    if (url === '/isAuth') {
      req.headers.Authorization = `Bearer ${getAccessToken()}`;
    } else {
    // if any other api Call, then check if it's authenticated
    // if not, try to get a new token and make the call
      const authenticated = await authenticate();
      if (authenticated) {
        req.headers.Authorization = `Bearer ${getAccessToken()}`;
      }
    }
  }  
  return req;
}, error => Promise.reject(error));

export { api };