import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../../api/axios';
import clsx from 'clsx';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import style from './style.module.scss';

function ResetPassword() {
  const { token } = useParams();
  const [tokenExpired, setTokenExpired] = useState(false);
  const [account, setAccount] = useState({ password: '' });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const validateURL = async () => {
      try {
        await axios.get('/checkURLReset', { params: { token } });
      } catch (error) {
        setTokenExpired(true);
      }
    };
    validateURL();
  }, []);

  const navigate = useNavigate();
  const changeValue = async (e) => {
    setAccount((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      if (account.password !== account.passwordConfirm) {
        toast.error('Mật khẩu không khớp', { position: 'bottom-right', theme: 'dark' });
      } else {
        setIsLoading(true);
        const res = await axios.put('/resetPassword', { password: account.password }, { params: { token } });
        if (res.status === 200) {
          toast.success('Đã cập nhật mật khẩu', { position: 'bottom-right', theme: 'dark' });
        }
        setIsLoading(false);

        setTimeout(() => {
          navigate('/auth');
        }, 5000);
      }
    } catch (error) {
      toast.error('Cập nhật không thành công', { position: 'bottom-right', theme: 'dark' });
    }
  };

  return (
    <div
      className="modal fade show"
      id="UserConfirm"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="UserConfirmLabel"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="UserConfirmLabel">
              Cập nhật mật khẩu
            </h4>
          </div>
          <div className="modal-body">
            <div className="container height-100 d-flex justify-content-center align-items-center">
              {tokenExpired ? (
                <div>Đường dẫn đã hết hạn</div>
              ) : (
                <div className="position-relative">
                  <div className="card p-2 text-center border-0">
                    <h5>Vui lòng nhập mật khẩu bạn muốn thay đổi</h5>

                    <form onSubmit={handleResetPassword}>
                      <div>
                        <input
                          className="m-2 text-center form-control "
                          type="password"
                          style={{ fontSize: 20 }}
                          value={account.password || ''}
                          name="password"
                          onChange={changeValue}
                          placeholder="Mật khẩu"
                          required
                        />
                        <input
                          className="m-2 text-center form-control "
                          type="password"
                          style={{ fontSize: 20 }}
                          name="passwordConfirm"
                          onChange={changeValue}
                          placeholder="Nhập lại mật khẩu"
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <button type="submit" disabled={isLoading} className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg', 'validate')}>
                          {isLoading ? <div className="spinner-border text-primary" role="status"></div> : 'Cập Nhật'}
                        </button>
                      </div>
                    </form>
                  </div>
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

export default ResetPassword;
