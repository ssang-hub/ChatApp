import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import jwtDecode from 'jwt-decode';
import axios from '../../api/axios';
import clsx from 'clsx';

import { FcGoogle } from 'react-icons/fc';
import { AiOutlineUser, AiFillBackward } from 'react-icons/ai';

import { GoogleLogin } from 'react-google-login';
import { gapi } from 'gapi-script';

import { ToastContainer, toast } from 'react-toastify';
import style from './style.module.scss';
import 'react-toastify/dist/ReactToastify.css';
import { login } from '../../store/reducers/auth.slice';

function Auth() {
  const [authOption, setAuthOption] = useState('login');
  const [user, setUser] = useState({
    accountName: '',
    password: '',
  });
  const [email, setEmail] = useState();
  const [IsLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_NAMEAPP)) {
      navigate('/');
    }
    gapi.load('client:auth2', () => {
      gapi.auth2.init({ clientId: process.env.REACT_APP_GOOGLE });
    });
  }, []);

  // handle login with account name and password
  const hadleLogin = async (event) => {
    event.preventDefault();
    if (!(user.accountName && user.password)) {
      toast.error('Vui lòng nhập đầy đủ thông tin', { theme: 'dark', position: 'bottom-right' });
    } else {
      try {
        setIsLoading(true);
        const { data } = await axios.post('/login', { user });
        dispatch(login({ ...data, user: jwtDecode(data.accessToken) }));
        localStorage.setItem(process.env.REACT_APP_NAMEAPP, JSON.stringify(data));
        window.location.reload();
      } catch (error) {
        error.response && error.response.status !== 403
          ? toast.error('Vui lòng nhập lại thông tin', { position: 'bottom-right', theme: 'dark' })
          : toast.error('Tài khoản hoặc mật khẩu không chính xác', { position: 'bottom-right', theme: 'dark' });
        setIsLoading(false);
      }
    }
  };

  // handle login with google
  const googleAuth = async (profileObj) => {
    const { data } = await axios.post('/googleVerify', { tokenId: profileObj.tokenId });
    dispatch(login({ ...data, user: jwtDecode(data.accessToken) }));
    localStorage.setItem(process.env.REACT_APP_NAMEAPP, JSON.stringify(data.data));
    navigate('/');
  };

  const responseGoogle = (response) => {
    console.log(response);
  };

  const handleRegister = async (event) => {
    event.preventDefault();

    if (!(user.fullName && user.password && user.passwordConfirm && user.accountName)) {
      toast.error('Vui lòng nhập đầy đủ thông tin', { theme: 'dark', position: 'bottom-right' });
    } else if (!(user.password === user.passwordConfirm)) {
      toast.error('Mật khẩu không khớp', { theme: 'dark', position: 'bottom-right' });
    } else {
      try {
        setIsLoading(true);
        const result = await axios.post('/register', { user });
        if (result.status === 200) toast.success('Tạo tài khoản thành công', { position: 'bottom-right', theme: 'dark' });
        setIsLoading(false);
      } catch (error) {
        error.response && error.response.status === 403 && toast.error('Tên tài khoản đã tồn tại', { position: 'bottom-right', theme: 'dark' });
        setIsLoading(false);
      }
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    if (email) {
      try {
        const { status } = await axios.post('/forgotPassword', { email });
        status === 200 && toast.success('Vui lòng kiểm tra email', { position: 'bottom-right', theme: 'dark' });
      } catch (error) {
        error.response && error.response.status === 403 && toast.error('Không tìm thấy email đã nhập', { position: 'bottom-right', theme: 'dark' });
      }
    }
  };

  const changeValue = (event) => {
    setUser((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  return (
    <div>
      <div className={clsx('container', [style['float-in']])}>
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-8 col-lg-6 col-xl-5">
            <div className={clsx(style.card, 'card', 'py-5', 'px-2')}>
              <p className="text-center mb-3 mt-2">APP CHAT NODEJS</p>
              {/* social authentication */}
              <div className="mx-auto d-flex">
                <GoogleLogin
                  clientId={process.env.REACT_APP_GOOGLE}
                  onSuccess={googleAuth}
                  onFailure={responseGoogle}
                  cookiePolicy={'single_host_origin'}
                  // buttonText="Login"
                  render={(renderProps) => (
                    <div className={clsx('mx-2', 'px-3', 'py-2', style.socialBtn)} onClick={renderProps.onClick} disabled={renderProps.disabled}>
                      <FcGoogle />
                    </div>
                  )}
                />
              </div>
              <div className={clsx('division', style.division)}>
                <div>
                  <div className="col-6 m-auto">
                    <span>OU AVEC MON EMAIL</span>
                  </div>
                  <hr />
                </div>
              </div>
              {/*  */}
              {authOption !== 'forgot' ? (
                <form onSubmit={authOption === 'login' ? hadleLogin : handleRegister} className={clsx(style.myform)}>
                  <div className="form-group">
                    <input type="text" name="accountName" className={clsx('form-control', style.formInput)} onChange={(e) => changeValue(e)} placeholder="Tên tài khoản" required />
                  </div>
                  {authOption === 'register' && (
                    <div className="form-group">
                      <input type="text" name="fullName" className={clsx('form-control', style.formInput)} onChange={(e) => changeValue(e)} placeholder="Tên người dùng" required />
                    </div>
                  )}
                  <div className="form-group">
                    <input type="password" name="password" className={clsx('form-control', style.formInput)} onChange={(e) => changeValue(e)} placeholder="Mật khẩu" required />
                  </div>
                  {authOption === 'register' && (
                    <div className="form-group">
                      <input
                        type="password"
                        name="passwordConfirm"
                        className={clsx('form-control', style.formInput)}
                        onChange={(e) => changeValue(e)}
                        placeholder="Xác nhận mật khẩu"
                        required
                      />
                    </div>
                  )}
                  <div className="row">
                    <div className="col-md-6 col-12">
                      <div className={clsx('col-md-8', 'col-12', style.bn)} onClick={() => setAuthOption('forgot')}>
                        Quên mật khẩu
                      </div>
                    </div>
                    {authOption === 'login' ? (
                      <div className={clsx('col-md-5', 'col-12', style.bn)} onClick={() => setAuthOption('register')}>
                        Đăng ký
                      </div>
                    ) : (
                      <div className={clsx('col-md-5', 'col-12', style.bn)} onClick={() => setAuthOption('login')}>
                        Đăng Nhập
                      </div>
                    )}
                  </div>
                  <div className="form-group mt-3">
                    {authOption === 'login' ? (
                      <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                        {IsLoading ? (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <small>
                            <AiOutlineUser className="mx-1" />
                            Đăng Nhập
                          </small>
                        )}
                      </button>
                    ) : (
                      <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                        {IsLoading ? (
                          <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                        ) : (
                          <small>
                            <AiOutlineUser className="mx-1" />
                            Đăng Ký
                          </small>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div>
                  <form onSubmit={(e) => handleForgotPassword(e)}>
                    <div className="m-auto" style={{ width: '85%' }}>
                      <input
                        className={clsx('form-control', style.formInput)}
                        type="email"
                        placeholder="Email khôi phục"
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                      />
                    </div>
                    <div>
                      <div className="w-100">
                        <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg')}>
                          Xác nhận
                        </button>
                      </div>
                      <div
                        className="btn text-secondary"
                        onClick={() => {
                          setAuthOption('login');
                        }}
                      >
                        <AiFillBackward />
                        Quay lại đăng nhập
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </div>
  );
}
export default Auth;
