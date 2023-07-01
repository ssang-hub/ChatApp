import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import { BsChatDots, BsBell } from 'react-icons/bs';
import { AiOutlineSetting, AiOutlineUsergroupAdd } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { lougout } from '../../store/reducers/auth.slice';
import style from './style.module.scss';
import Setting from './Setting';
import UserDetail from './userDetail';
import { getNumberRequest } from '../../store/reducers/friendRequest.slice';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function Nav({ OptionNav, setOptionNav }) {
  const [userDetail, setUserDetail] = useState();
  const dispatch = useDispatch();

  // const [viewMyProfile, setViewMyProfile] = useState(false);
  // const socket = useScoket()
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const getMyInformation = async () => {
      try {
        const { data } = await axiosPrivate.get(`/getInformation`);
        setUserDetail(data);
      } catch (error) {
        console.log(error);
      }
    };
    getMyInformation();
  }, []);

  useEffect(() => {
    dispatch(getNumberRequest());
  }, []);
  const logoutAction = () => {
    localStorage.removeItem(process.env.REACT_APP_NAMEAPP);
    dispatch(lougout());
    window.location.reload();
  };

  return (
    <div style={{ backgroundColor: '#343a404d' }}>
      {userDetail && (
        <div>
          <div className="dashboard d-flex flex-column justify-content-between w-5 mt-4 " style={{ width: 80 }}>
            <div className="d-flex flex-column">
              <div className="user my-3">
                <div className="btn-group dropend">
                  <button type="button" className={clsx('btn', 'p-0', 'dropdown-toggle', [style['btn-user']])} data-bs-toggle="dropdown" aria-expanded="false">
                    <img style={{ width: '100%', borderRadius: '50%' }} src={`${userDetail.avatar}`} alt="" />
                  </button>
                  <ul className={clsx([style['user-menu']], 'dropdown-menu')}>
                    <li>
                      <h5 className="px-3">{userDetail.userName}</h5>
                    </li>
                    <hr />
                    <li className={style.hoverOptionBtn}>
                      <div className={clsx(style.optionBtn, 'px-3')} data-bs-toggle="modal" data-bs-target="#infomationContainer">
                        Hồ sơ của bạn
                      </div>
                    </li>
                    <li className={style.hoverOptionBtn}>
                      <div className={clsx('px-3', style.optionBtn)} data-bs-toggle="modal" data-bs-target="#settingContainer">
                        Cài đặt
                      </div>
                    </li>
                    <hr />
                    <li>
                      <div className={style.logoutBtn} onClick={(e) => logoutAction(e)}>
                        Đăng xuất
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
              <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: OptionNav === 'chat' })} onClick={() => setOptionNav('chat')}>
                <BsChatDots />
              </div>
            </div>
            <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: OptionNav === 'friend' })} onClick={() => setOptionNav('friend')}>
              <div className="pb-2 position-relative">
                <AiOutlineUsergroupAdd />
                <div className={clsx([style['number-Request']], 'btn-danger', 'px-1')}></div>
              </div>
            </div>
            <div className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: OptionNav === 'notify' })} onClick={() => setOptionNav('notify')}>
              <BsBell />
            </div>
            <div
              className={clsx('chatApp', 'text-light', 'font-size-25', 'btn', 'py-3', { [style['btnActive']]: OptionNav === 'Setting' })}
              onClick={() => setOptionNav('Setting')}
            >
              {' '}
              <AiOutlineSetting />
            </div>
          </div>
          <Setting />

          <UserDetail userDetail={userDetail} setUserDetail={setUserDetail} />
        </div>
      )}
    </div>
  );
}

export default React.memo(Nav);
