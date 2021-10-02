import * as jwt from 'jsonwebtoken';

const { REACT_APP_TOKEN_KEY } = process.env;

let accessToken = '';
let expiration = '';

const setAccessToken = (token) => {
  accessToken = token;
  const { iat, exp } = getDecodedToken();
  const duration = exp - iat;
  expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + duration - 10);
  console.log(`Token is expired ${isTokenExpired()}`)
}

const getAccessToken = () => {
  return accessToken
}

const getDecodedToken = () => {
  return jwt.decode(accessToken, REACT_APP_TOKEN_KEY);
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

export { setAccessToken, getAccessToken, getDecodedToken, isTokenExpired };