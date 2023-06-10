import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '../store/reducers/auth.slice';
import { authSelector } from '../store/selectors';
import useRefreshToken from './useRefreshToken';

function useAxiosPrivate() {
  const handleRefreshToken = useRefreshToken();
  const user = useSelector(authSelector);
  const dispatch = useDispatch();
  useEffect(() => {
    if (user.isAuthenticated) {
      // set token to header http request
      const requestInterceptor = axiosPrivate.interceptors.request.use(
        (config) => {
          if (!config.headers['Authorization']) {
            config.headers['Authorization'] = `Bearer ${user.accessToken}`;
          }
          return config;
        },
        (error) => Promise.reject(error),
      );
      // call  refresh token
      const responseInterceptor = axiosPrivate.interceptors.response.use(
        (response) => response,
        async (error) => {
          const prevRequest = error.config;
          if (error.response.status === 401) {
            const newToken = await handleRefreshToken();
            // console.log(newToken);
            prevRequest.headers['Authorization'] = `Bearer ${newToken.accessToken}`;
            dispatch(refreshToken(newToken));
            localStorage.setItem(process.env.REACT_APP_NAMEAPP, JSON.stringify(newToken));
            return axiosPrivate(prevRequest);
          }
        },
      );
      return () => {
        axiosPrivate.interceptors.request.eject(requestInterceptor);
        axiosPrivate.interceptors.response.eject(responseInterceptor);
      };
    }
  }, [user]);
  return axiosPrivate;
}

export default useAxiosPrivate;
