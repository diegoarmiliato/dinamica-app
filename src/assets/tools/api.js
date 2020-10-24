import axios from 'axios';

const apiHeaders = { 'Access-Control-Allow-Origin': '*' };

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  headers: apiHeaders,
  withCredentials: true
});

export { apiHeaders, api };