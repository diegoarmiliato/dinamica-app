import { api } from './../assets/tools/api';
import * as jwt from 'jsonwebtoken';

let accessToken = '';
let expiration = '';

const setAccessToken = (token) => {
  accessToken = token;
  const { iat, exp } = getDecodedToken();
  const duration = exp - iat;
  expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + duration - 10);
}

const getAccessToken = () => {
  return accessToken
}

const getDecodedToken = () => {
  return jwt.decode(accessToken);
}

const isTokenExpired = () => {
  if (!accessToken) {
    return true;
  }
  const now = new Date();
  if (now > expiration) {
    return true;
  }
  return false;
}

const authenticate = async () => {
  // if token not expired, check if server trusts it
  if (!isTokenExpired()) {
    try {
      const authCall = await api.post('/isAuth');
      const { status } = authCall;
      if (status === 202) {
        // Authentication Success with current Token
        return true;
      }
    } catch (error) { 
      console.error(error);
    }
  }
  // If token authentication failed, try to use refresh token
  try {
    const refreshCall = await api.post('/refresh');
    const { token } = refreshCall.data;
    if (refreshCall.status === 202 && token) {
      // Authentication Success with new Token
      setAccessToken(token);
      return true;
    } 
  } catch (error) {
    console.error(error);    
  }  
  // If both token and refresh token authentications failed, then return false
  return false;
}

export { setAccessToken, getAccessToken, getDecodedToken, isTokenExpired, authenticate };