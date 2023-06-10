import { io } from 'socket.io-client';
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { authSelector } from '../store/selectors';
const useScoket = () => {
  const socket = useRef(io(process.env.REACT_APP_SERVER));
  return socket;
};
// export const useSocketConfig = () => {
//   const socket = useRef(io(process.env.REACT_APP_SERVER))

// }
export default useScoket;
