import React, { useRef, useEffect } from 'react';
import { Peer } from 'peerjs';
import { authSelector, peerSelector } from '../../store/selectors';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import style from './style.module.scss';

const VideoCall = () => {
  const authSelect = useSelector(authSelector);
  const peerIdCall = useSelector(peerSelector);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const navigate = useNavigate();
  useEffect(() => {
    console.log();
    if (!peerIdCall.id) {
      navigate('/');
    }
    const peer = new Peer();
    peer.on('open', (id) => {
      console.log('Connected with Id: ' + id);
      navigator.getUserMedia(
        { video: true, audio: true },
        (stream) => {
          localVideoRef.current.srcObject = stream;
          let call = peer.call(`DELTA${peerIdCall.id}MEET`, stream);
          call.on('stream', (stream) => {
            remoteVideoRef.current.srcObject = stream;
          });
        },
        (err) => {
          console.log(err);
        },
      );
    });
  }, []);

  return (
    <div>
      <div style={{ height: '100vh' }} className="position-relative">
        <video className={style.remoteVideo} ref={remoteVideoRef} autoPlay muted></video>
      </div>
      <div style={{ zIndex: 3, bottom: 0, right: 0 }} className="border border-danger position-absolute">
        <video className={style.localVideo} ref={localVideoRef} autoPlay muted></video>
      </div>
    </div>
  );
};

export default VideoCall;
