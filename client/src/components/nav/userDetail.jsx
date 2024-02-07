import React, { useEffect, useState } from 'react';
import { IoChevronBackOutline } from 'react-icons/io5';
import { AiOutlineCamera } from 'react-icons/ai';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import style from './style.module.scss';
import clsx from 'clsx';
import { updateUser } from '../../store/reducers/auth.slice';
import { useDispatch } from 'react-redux';

function UserDetail({ userDetail, setUserDetail }) {
  const [changeState, setChangeState] = useState(false);
  const [changeMyProfile, setChangeMyProfile] = useState();
  const axiosPrivate = useAxiosPrivate();

  // avatar user
  const [avatar, setAvatar] = useState(userDetail.avatar);
  const [coverAvatar, setCoverAvatar] = useState(userDetail.coverAvatar);

  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      avatar && URL.revokeObjectURL(avatar);
    };
  }, [avatar]);
  useEffect(() => {
    return () => {
      coverAvatar && URL.revokeObjectURL(coverAvatar);
    };
  }, [coverAvatar]);

  const changeInfomation = (event) => {
    setChangeMyProfile((prevState) => {
      return { ...prevState, [event.target.name]: event.target.value };
    });
  };

  const handleChangeProfile = async () => {
    try {
      const result = await axiosPrivate.put('/updateMyProfile', changeMyProfile);
      setUserDetail(result.data);
      setChangeMyProfile(result.data);
      dispatch(updateUser(result.data));
      setChangeState(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <div
        className="modal fade"
        id="infomationContainer"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="infomationContainer"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">
                <div className="d-flex">
                  <div className="btn" onClick={() => setChangeState(false)}>
                    <IoChevronBackOutline />
                  </div>
                  <h5 className="pt-2">Thông tin tài khoản</h5>
                </div>
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body padding-15px overflow-hidden ">
              <div>
                <div className="mb-2">
                  <div className="position-relative">
                    <div>
                      <img className="w-100" src={coverAvatar} alt="" />
                      {changeState && (
                        <div>
                          <label htmlFor="upload-cover-avatar" className="d-block">
                            <div className={style.cameraIcon} style={{ left: 5 }}>
                              <AiOutlineCamera />
                            </div>
                          </label>
                          <input
                            type="file"
                            name="coverAvatar"
                            id="upload-cover-avatar"
                            className={style.uploadPhoto}
                            onChange={(e) => setCoverAvatar(URL.createObjectURL(e.target.files[0]))}
                          />
                        </div>
                      )}
                    </div>
                    <div className="position-absolute w-100" style={{ bottom: -15 }}>
                      {changeState ? (
                        <div>
                          <label htmlFor="upload-avatar">
                            <img className={clsx(style.avatarDetail, 'position-relative')} src={avatar} alt="" />
                            <div className={style.cameraIcon}>
                              <AiOutlineCamera />
                            </div>
                          </label>
                          <input type="file" name="avatar" id="upload-avatar" className={style.uploadPhoto} onChange={(e) => setAvatar(URL.createObjectURL(e.target.files[0]))} />
                        </div>
                      ) : (
                        <img className={style.avatarDetail} src={avatar} alt="" />
                      )}
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4>{userDetail.fullName}</h4>
                  <div className={style.infomationDetail}>
                    <h6 className="d-flex">Thông tin cá nhân</h6>
                    <div className="mt-4">
                      <table className="table">
                        <tbody>
                          <tr className="d-flex">
                            <td>Ngày Sinh:</td>
                            <td>
                              {changeState ? (
                                <div>
                                  <input type="date" name="DOB" onChange={(e) => changeInfomation(e)} className="form-control" id="" defaultValue={userDetail.DOB} />
                                </div>
                              ) : (
                                <div>{userDetail.DOB}</div>
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Địa chỉ:</td>
                            <td>
                              {changeState ? (
                                <div>
                                  <input
                                    type="text"
                                    name="address"
                                    onChange={(e) => changeInfomation(e)}
                                    className="form-control"
                                    style={{ marginLeft: 20 }}
                                    defaultValue={userDetail.address}
                                  />
                                </div>
                              ) : (
                                userDetail.address
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Giới tính:</td>
                            <td>
                              {changeState ? (
                                <div>
                                  <select name="gender" onChange={(e) => changeInfomation(e)} defaultValue={userDetail.gender} className="form-control form-select" id="">
                                    <option value="Nam">Nam</option>
                                    <option value="Nữ">Nữ</option>
                                    <option value="Khác">Khác</option>
                                  </select>
                                </div>
                              ) : (
                                userDetail.gender
                              )}
                            </td>
                          </tr>
                          <tr className="d-flex">
                            <td>Email:</td>
                            <td>
                              {changeState ? (
                                <div>
                                  <input
                                    type="email"
                                    name="email"
                                    onChange={(e) => changeInfomation(e)}
                                    className="form-control"
                                    style={{ marginLeft: 20 }}
                                    defaultValue={userDetail.email}
                                  />
                                </div>
                              ) : (
                                userDetail.email
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              {changeState ? (
                <button className="btn btn-outline-success" onClick={() => handleChangeProfile()}>
                  Lưu lại
                </button>
              ) : (
                <button className="btn btn-outline-primary" onClick={() => setChangeState(true)}>
                  Chỉnh sửa
                </button>
              )}

              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
