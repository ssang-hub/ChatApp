import React from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import { useState } from 'react';
import style from '../style.module.scss';
import { IoChevronBackOutline } from 'react-icons/io5';
import clsx from 'clsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import useScoket from '../../../hooks/useSocket';

function AddFriend({ user }) {
  const [friend, setFriend] = useState('');
  const [resultSearch, setResultSearch] = useState([]);
  const [userData, setUserData] = useState(undefined);

  const [searchLoading, setSearchLoading] = useState(false);

  const axiosPrivate = useAxiosPrivate();
  const socket = useScoket();

  const [firstMessage, setfirstMessage] = useState(undefined);

  const getUserInfomation = async (e, userSelected) => {
    try {
      const responseData = await axiosPrivate.get(`getUserInfomation/${userSelected}`);
      setUserData(responseData.data);
    } catch (error) {
      console.log(error);
    }
  };
  const addFriend = () => {
    try {
      if (firstMessage) {
        socket.current.emit('friend-Request-request', { from: user._id, to: userData._id, message: firstMessage });
        const addFriendBtn = document.getElementById('add-friend-btn');
        addFriendBtn.classList.add('disabled');
        addFriendBtn.textContent = 'Đã gửi';
        setResultSearch((prevState) => {
          return prevState.map((item) => {
            if (item._id.toString() === userData._id.toString()) {
              return { ...item, pendingAccept: true };
            }
            return item;
          });
        });
        toast.success('Gửi đề nghị thành công', { position: 'bottom-right', theme: 'dark' });
        // window.location.reload();
      } else {
        toast.error('Vui lòng nhập lời chào', { position: 'bottom-right', theme: 'dark' });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const CancelRequest = async (userId) => {
    try {
      await axiosPrivate.delete(`cancelFriendRequest`, { params: { id: userId } });
      setResultSearch((prevState) => {
        return prevState.map((item) => {
          if (item._id.toString() === userId.toString()) {
            return { ...item, peddingAccept: false };
          }
          return item;
        });
      });
      toast.error('Hủy kết bạn thành công', { theme: 'dark', position: 'bottom-right' });
    } catch (error) {
      console.log(error);
    }
  };
  const searchFriend = async (e) => {
    e.preventDefault();
    try {
      setSearchLoading(true);
      const responeData = await axiosPrivate.post('/searchUser', { friend });
      setResultSearch(responeData.data);
      setSearchLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div
      className="modal fade"
      id="addFriendContainer"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="addFriendContainerLabel"
      aria-hidden="true"
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5" id="addFriendContainerLabel">
              {userData ? (
                <div className="d-flex">
                  <div className="btn " onClick={() => setUserData(undefined)}>
                    <IoChevronBackOutline />
                  </div>
                  <h5 className="pt-2">Thông tin tài khoản</h5>
                </div>
              ) : (
                <div>Thêm bạn</div>
              )}
            </h1>
          </div>
          <div className="modal-body padding-15px ">
            {!userData ? (
              <div>
                <div className="d-flex">
                  <div className="mx-3 mt-2">
                    <h5>Tên người dùng:</h5>
                  </div>

                  <form onSubmit={searchFriend} id="searchFriend">
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => {
                        setFriend(e.target.value);
                      }}
                    />
                  </form>
                </div>
                <div className={style.searchResult}>
                  {resultSearch.map((item) => (
                    <div className="row my-4 fix-Scroll-addFriend" key={item._id}>
                      <div className="col-xl-3">
                        <img className={clsx([style.avatar])} src={item.avatar} alt="" />
                      </div>
                      <div className="col-xl-5">{item.userName}</div>
                      <div className="col-xl-3 p-1">
                        {item.pendingAccept ? (
                          <div className="btn btn-outline-danger h-100 w-120" onClick={() => CancelRequest(item._id)}>
                            Hủy kết bạn
                          </div>
                        ) : (
                          <div className="btn btn-outline-primary h-75 w-120" onClick={(e) => getUserInfomation(e, item._id)}>
                            Chi tiết
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="mb-2">
                  <div className="position-relative">
                    <img className="w-100" src={userData.coverAvatar} alt="" />
                    <div className="position-absolute w-100" style={{ bottom: -15 }}>
                      <img className={style.avatarDetail} src={userData.avatar} alt="" />
                    </div>
                  </div>
                </div>
                <div className="mt-4">
                  <h4>{userData.userName}</h4>
                  <div className={style.infomationDetail}>
                    <h6 className="d-flex">Thông tin cá nhân</h6>
                    <div className="row mt-4">
                      <div className="col-xl-4 ">
                        <div className="d-flex my-2 text-secondary">Giới tính:</div>
                        <div className="d-flex my-2 text-secondary">Số điện thoại:</div>
                        <div className="d-flex my-2 text-secondary">Địa chỉ:</div>
                      </div>
                      <div className="col-xl-4">
                        <div className="my-2">{userData.gender}</div>
                        <div className="my-2">{userData.phone || 'Trống'}</div>
                        <div className="my-2">{userData.address || 'Trống'}</div>
                      </div>
                    </div>
                  </div>
                </div>
                {firstMessage !== undefined && (
                  <div
                    className="mb-3"
                    onChange={(e) => {
                      setfirstMessage(e.target.value);
                    }}
                    value={firstMessage}
                  >
                    <textarea className="form-control" rows="3" placeholder="Vui lòng gửi lời chào đến người này..."></textarea>
                  </div>
                )}
              </div>
            )}
          </div>
          {/* {userData && <UserDtail userData={userData} />} */}

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Đóng
            </button>
            {!userData ? (
              <button type="submit" disabled={searchLoading} className="btn btn-primary" form="searchFriend">
                {searchLoading ? <div class="spinner-border text-info" style={{ height: 20, width: 20 }} role="status"></div> : 'Tìm Kiếm'}
              </button>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary"
                id="add-friend-btn"
                onClick={() => {
                  firstMessage === undefined ? setfirstMessage('') : addFriend();
                }}
              >
                Kết bạn
              </button>
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default AddFriend;
