import React from 'react';
import clsx from 'clsx';
import style from './style.module.scss';
import { useState } from 'react';
import axios from '../../api/axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function VerifyCode({ userRecovery, setUserRecovery }) {
  const [dataRecovery, setDataRecovery] = useState(userRecovery);
  const [checkCodeNumber, setCheckCodeNumber] = useState(false);
  const verifyRecoveryPassword = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/verifyRecoveryPassword', { dataRecovery });
      // console.log(res.data);
      res.status === 200 && setCheckCodeNumber(res.data);
    } catch (error) {
      error.response && error.response.status === 403 && toast.error('Mã xác nhận không hợp lệ', { position: 'bottom-right', theme: 'dark' });
    }
  };
  const changeValue = async (e) => {
    setDataRecovery((prevState) => {
      return { ...prevState, [e.target.name]: e.target.value };
    });
  };
  const recoveryPassword = async (e) => {
    e.preventDefault();
    try {
      if (dataRecovery.password !== dataRecovery.passwordConfirm) {
        toast.error('Mật khẩu không khớp', { position: 'bottom-right', theme: 'dark' });
      } else {
        const { numberCode, passwordConfirm, ...datasend } = dataRecovery;
        const res = await axios.put('/recoveryPassword', { datasend });
        if (res.status === 200) {
          toast.success('Đã cập nhật mật khẩu', { position: 'bottom-right', theme: 'dark' });
        }
      }
    } catch (error) {
      toast.error('Cập nhật không thành công', { position: 'bottom-right', theme: 'dark' });
    }
  };
  const handleClose = () => {
    setCheckCodeNumber(false);
    setUserRecovery(false);
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
            {checkCodeNumber ? (
              <h4 className="modal-title" id="UserConfirmLabel">
                Cập nhật mật khẩu
              </h4>
            ) : (
              <h4 className="modal-title" id="UserConfirmLabel">
                Xác thực tài khoản
              </h4>
            )}

            <button type="button" className="btn-close" onClick={() => handleClose()}></button>
          </div>
          <div className="modal-body">
            <div className="container height-100 d-flex justify-content-center align-items-center">
              <div className="position-relative">
                <div className="card p-2 text-center border-0">
                  {checkCodeNumber ? (
                    <h5>Vui lòng nhập mật khẩu bạn muốn thay đổi</h5>
                  ) : (
                    <h5>
                      Vui lòng nhập mã đã được gửi đến email: <span className="text-secondary">{userRecovery.email}</span> của bạn
                    </h5>
                  )}

                  <form onSubmit={checkCodeNumber ? recoveryPassword : verifyRecoveryPassword}>
                    {!checkCodeNumber ? (
                      <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                        <input
                          className="m-2 text-center form-control rounded py-3"
                          style={{ fontSize: 20, width: '40%' }}
                          name="numberCode"
                          maxLength={6}
                          minLength={6}
                          onChange={changeValue}
                          placeholder="000000"
                          required
                        />
                      </div>
                    ) : (
                      <div>
                        <input
                          className="m-2 text-center form-control "
                          type="password"
                          style={{ fontSize: 20 }}
                          value={dataRecovery.password || ''}
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
                    )}

                    <div className="mt-4">
                      <button type="submit" className={clsx(style.submitBtn, 'btn', 'btn-block', 'btn-primary', 'btn-lg', 'validate')}>
                        {checkCodeNumber ? 'Cập Nhật' : 'Xác thực'}
                      </button>{' '}
                    </div>
                  </form>
                </div>
                {!checkCodeNumber && (
                  <div>
                    {' '}
                    <span>
                      <a href="">Bạn chưa nhận được mã ?</a>
                    </span>{' '}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default VerifyCode;
