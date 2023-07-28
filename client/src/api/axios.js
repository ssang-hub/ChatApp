import axios from 'axios';
export default axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}`,
});

export const axiosPrivate = axios.create({
  baseURL: `${process.env.REACT_APP_SERVER}`,
  headers: { 'Content-type': 'application/json' },
});
