import clsx from 'clsx';
import React, { useState } from 'react';
import { AiOutlineUsergroupAdd, AiOutlineSearch, AiOutlineVideoCamera } from 'react-icons/ai';
import style from './style.module.scss';
import useScoket from '../../hooks/useSocket';
import { v4 as uuidv4 } from 'uuid';
function Header({ chatCurrent, user }) {
  const socket = useScoket();
  const [room, setRoom] = useState();
  const handleVideoCall = () => {
    const roomId = uuidv4();
    socket.current.emit('create-video-chat', { from: user._id, to: chatCurrent._id });
  };
  return (
    <div className={clsx('d-flex', 'justify-content-between', 'p-3', style.header)}>
      <div className="d-flex">
        <div>
          <img className={style.avatar} src={chatCurrent.avatar} alt="" />
        </div>
        <h5 className="m-auto">{chatCurrent.userName}</h5>
      </div>
      <div className="d-flex justify-content-around">
        <div className={clsx('m-auto', [style['btn-header-chat']])} data-bs-toggle="modal" data-bs-target="#addGroupContainer">
          <AiOutlineUsergroupAdd />
        </div>
        <div className={clsx('m-auto', [style['btn-header-chat']])}>
          <AiOutlineSearch />
        </div>
        <div className={clsx('m-auto', [style['btn-header-chat']])} onClick={() => handleVideoCall()}>
          <AiOutlineVideoCamera />
        </div>
      </div>
    </div>
  );
}

export default Header;
