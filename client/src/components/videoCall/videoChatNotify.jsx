import React from 'react';
import { AiOutlineClose, AiOutlinePhone } from 'react-icons/ai';

function VideoChatNotify({ chatVideoNotifydata, socketCurrent }) {
  const refuseVideoCall = () => {
    socketCurrent.emit('refuse-video-call', { chatVideoNotifydata });
  };
  const acceptVideoCall = () => {
    socketCurrent.emit('acceptVideoCall-video-call', { chatVideoNotifydata });
  };
  return (
    <div style={{ zIndex: 2 }}>
      <div
        className="modal fade show"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabIndex={-1}
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true"
        style={{ display: 'block' }}
      >
        <div className="modal-dialog  modal-dialog-centered">
          <div className="modal-content" style={{ backgroundColor: '#19123b' }}>
            <div className="modal-body">
              <div>
                <img style={{ borderRadius: '50%', width: 50, height: 50 }} src={chatVideoNotifydata.Callfrom.avatar} alt="" />
              </div>
              <div>
                <h3 className="text-light">{chatVideoNotifydata.Callfrom.userName} đang gọi cho bạn</h3>
                <div className="text-light">Cuộc gọi sẽ bắt đầu ngay khi bạn chấp nhận</div>
              </div>
              <div className="my-3">
                <div className="d-inline-block mx-3">
                  <div style={{ borderRadius: '50%' }} className="btn btn-danger text-light" onClick={() => refuseVideoCall}>
                    <AiOutlineClose />
                  </div>
                  <div className="text-light">Từ chối</div>
                </div>
                <div className="d-inline-block mx-3">
                  <div style={{ borderRadius: '50%' }} className="btn btn-success text-light">
                    <AiOutlinePhone />
                  </div>
                  <div className="text-light" onClick={() => acceptVideoCall}>
                    Chấp nhận
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoChatNotify;
