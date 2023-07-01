import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import clsx from 'clsx';
import style from '../style.module.scss';
function SettupavatarGroup({ setSelectAvatarGroup, avatarSelected, setAvatarSelected }) {
  const [DefaultAvatarGroup, setDefaultAvatarGroup] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getDefaultAvatarGroup = async () => {
      const { data } = await axiosPrivate.get('/getAllCustomAvatarGroup');
      setDefaultAvatarGroup(data);
    };
    getDefaultAvatarGroup();
  }, []);
  return (
    <div
      className="modal fade show"
      id="addGroupContainer"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="AddGroupContainer"
      aria-hidden="true"
      style={{ display: 'block' }}
    >
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-body">
            <div className="row">
              {DefaultAvatarGroup.map((image, index) => (
                <div className={clsx('col-3', 'mt-2')} key={index} onClick={() => setAvatarSelected(image.avatar)}>
                  <img className={clsx({ [style['defaultAvatarSelected']]: avatarSelected === image }, 'w-100')} style={{ borderRadius: '50%' }} src={image.avatar} alt="" />
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setSelectAvatarGroup(false);
              }}
            >
              Hủy
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => {
                setSelectAvatarGroup(false);
              }}
            >
              Chọn ảnh
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettupavatarGroup;
