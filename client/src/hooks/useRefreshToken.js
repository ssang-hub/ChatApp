import axios from '../api/axios';
// import axios from "axios";

function useRefreshToken() {
  const refreshToken = async () => {
    try {
      const responseData = await axios({
        method: 'POST',
        url: '/refresh',
        headers: { Authorization: `Bearer ${JSON.parse(localStorage.getItem(process.env.REACT_APP_NAMEAPP)).refreshToken}` },
      });
      // localStorage.setItem(NameApp, JSON.stringify(responseData.data));
      // setAuth(responseData.data.accessToken);

      return responseData.data;
    } catch (error) {
      console.log(error);
    }
  };
  return refreshToken;
}

export default useRefreshToken;
