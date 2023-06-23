import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';

import { authSelector, RequestSelector, contactsSelector } from '../../store/selectors';
import { login } from '../../store/reducers/auth.slice';
import { receiverRequest } from '../../store/reducers/friendRequest.slice';
import { updatePeerIDCall } from '../../store/reducers/peer.slice';
import { updateNewRecentContacts } from '../../store/reducers/contacts.slice';

import WellCome from '../../components/wellcome';
import ChatContainer from '../../components/chatContainer';
import Nav from '../../components/nav';
import Sidebar from '../../components/sidebar';
import ChatInput from '../../components/chatInput';
import VideoChatNotify from '../../components/videoCall/videoChatNotify';

function Home() {
  const [chatCurrent, setChatCurrent] = useState(undefined);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [sendfileMessage, setSendFileMessage] = useState(null);
  const [messagesChatCurrent, setMessagesChatCurrent] = useState([]);

  const [OptionNav, setOptionNav] = useState('chat');
  const [chatVideoNotify, setChatVideoNotify] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);

  // socket
  const socket = useRef(io(process.env.REACT_APP_SERVER));

  // global state
  const authSelect = useSelector(authSelector);
  const RequestSelect = useSelector(RequestSelector);
  const contacts = useSelector(contactsSelector);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (!localStorage.getItem(process.env.REACT_APP_NAMEAPP)) {
      navigate('/auth');
    } else {
      const token = JSON.parse(localStorage.getItem(process.env.REACT_APP_NAMEAPP));
      dispatch(login({ ...token, user: jwtDecode(token.accessToken) }));
      socket.current.emit('accountConnect', jwtDecode(token.accessToken)._id);
      socket.current.on('msg-recieve', (msg) => {
        setArrivalMessages({ fromSelf: false, message: msg.message, from: msg.from });
        updateContactRecents(msg.from, msg.message.content);
      });
      socket.current.on('friend-Request-receive', (msg) => {
        // console.log(msg);
        dispatch(receiverRequest);
      });
      socket.current.on('created-video-chat-room', (chatRoom) => {
        console.log(chatRoom);
      });
      socket.current.on('receive-video-call', (call) => {
        console.log('callID', call.Callfrom._id);
        dispatch(updatePeerIDCall(call.Callfrom._id));
        setChatVideoNotify(call);
      });
      socket.current.on('image-receive', (msg) => {
        setArrivalMessages({ fromSelf: authSelect.user._id === msg.from, message: msg.message, from: msg.from });
        updateContactRecents(msg.from, 'Đã gửi một ảnh');
      });
      socket.current.on('send-image-success', (msg) => {
        const msgSend = { fromSelf: true, message: msg.message };
        setSendFileMessage(msgSend);
      });
      //  const getFriends = async () => {
      //    try {
      //      const { data } = await axiosPrivate.get('/getContacts');
      //      dispatch(setRecentContacts(data));
      //    } catch (error) {
      //      console.log(error);
      //    }
      //  };
      //  getFriends();
    }

    // console.log(RequestSelect);
  }, []);
  useEffect(() => {
    sendfileMessage && setMessagesChatCurrent((prevState) => [...prevState, sendfileMessage]);
  }, [sendfileMessage]);
  useEffect(() => {
    if (arrivalMessages && chatCurrent && arrivalMessages.from === chatCurrent._id) setMessagesChatCurrent((prevState) => [...prevState, arrivalMessages]);
  }, [arrivalMessages]);

  const updateContactRecents = (fromID, content, fromSelf) => {
    setTimeout(() => {
      const prevState = contacts.filter((item) => item.contact._id !== fromID);
      console.log('prevState', prevState);
      const updateAt = contacts.find((item) => item.contact._id === fromID);
      const newContacts = [{ ...updateAt, content: content, fromSelf: false }, ...prevState];
      console.log('new: ', newContacts);
    }, 0.2);

    // dispatch(updateNewRecentContacts({ data: newContacts }));
  };
  // console.log(contacts);
  return (
    <div>
      {authSelect.isAuthenticated && (
        <div className="application d-flex vh-100 overflow-hidden" id="home">
          <Nav OptionNav={OptionNav} setOptionNav={setOptionNav} user={authSelect.user} />
          <hr />

          <Sidebar setChatCurrent={setChatCurrent} setMessagesLoading={setMessagesLoading} OptionNav={OptionNav} user={authSelect.user} setMessages={setMessagesChatCurrent} />

          {chatCurrent ? (
            <div style={{ width: '100%' }}>
              {' '}
              <div style={{ height: '89%' }}>
                <ChatContainer
                  socketCurrent={socket.current}
                  chatCurrent={chatCurrent}
                  messages={messagesChatCurrent}
                  setMessages={setMessagesChatCurrent}
                  user={authSelect.user}
                  messagesLoading={messagesLoading}
                />
              </div>
              <div style={{ height: '11%' }}>
                <ChatInput
                  contacts={contacts}
                  updateContactRecents={updateContactRecents}
                  user={authSelect.user}
                  chatCurrent={chatCurrent}
                  setMessagesChatCurrent={setMessagesChatCurrent}
                />
              </div>
            </div>
          ) : (
            <WellCome />
          )}
          {chatVideoNotify && (
            <div>
              <VideoChatNotify chatVideoNotifydata={chatVideoNotify} socketCurrent={socket.current} fromSelf={false} setChatVideoNotify={setChatVideoNotify} />
              <div className="modal-backdrop fade show"></div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
