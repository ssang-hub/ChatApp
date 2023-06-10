import React, { useRef, useEffect, useState } from 'react';
import Peer from 'peerjs';

const VideoCall = () => {
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [peer, setPeer] = useState(null);
  const [call, setCall] = useState(null);

  useEffect(() => {
    const peer = new Peer();
    setPeer(peer);
    console.log(peer);
    peer.on('connection', function (conn) {
      conn.on('data', function (data) {
        // Will print 'hi!'
        console.log(data);
      });
    });
    return () => {
      peer.destroy();
    };
  }, []);

  const handleCall = (stream) => {
    const call = peer.call('b40de19d-2b3a-4732-bd14-3ddb546eafc5', stream);
    setCall(call);
    call.on('stream', (remoteStream) => {
      remoteVideoRef.current.srcObject = remoteStream;
    });
  };
  useEffect(() => {
    if (peer) {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          localVideoRef.current.srcObject = stream;
          peer.on('open', (id) => {
            handleCall(stream);
          });
        })
        .catch((error) => console.error(error));
    }
  }, [peer]);

  return (
    <div>
      <video ref={localVideoRef} autoPlay muted></video>
      <video ref={remoteVideoRef} autoPlay></video>
    </div>
  );
};

export default VideoCall;
