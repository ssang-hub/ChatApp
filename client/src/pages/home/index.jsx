import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import { authSelector, contactsSelector } from '../../store/selectors';
import { login } from '../../store/reducers/auth.slice';
import { updateNewRecentContacts } from '../../store/reducers/contacts.slice';

import WellCome from '../../components/wellcome';
import ChatContainer from '../../components/chatContainer';
import Nav from '../../components/nav';
import Sidebar from '../../components/sidebar';
import ChatInput from '../../components/chatInput';
import VideoChatNotify from '../../components/videoCall/videoChatNotify';

import { receiverRequest } from '../../store/reducers/friendRequest.slice';
import { updatePeerIDCall } from '../../store/reducers/peer.slice';

function Home() {
  const [chatCurrent, setChatCurrent] = useState(undefined);
  const [arrivalMessages, setArrivalMessages] = useState(null);
  const [sendfileMessage, setSendFileMessage] = useState(null);
  const [messagesChatCurrent, setMessagesChatCurrent] = useState([]);

  const [OptionNav, setOptionNav] = useState('chat');
  const [chatVideoNotify, setChatVideoNotify] = useState(false);

  // socket
  const socket = useRef(io(process.env.REACT_APP_SERVER));

  // global state
  const authSelect = useSelector(authSelector);
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
      socket.current.on('friend-Request-receive', (msg) => {
        dispatch(receiverRequest);
      });
      socket.current.on('created-video-chat-room', (chatRoom) => {
        console.log(chatRoom);
      });
      socket.current.on('receive-video-call', (call) => {
        dispatch(updatePeerIDCall(call.Callfrom._id));
        setChatVideoNotify(call);
      });
    }
  }, []);

  useEffect(() => {
    sendfileMessage && setMessagesChatCurrent((prevState) => [...prevState, sendfileMessage]);
  }, [sendfileMessage]);
  useEffect(() => {
    if (arrivalMessages && chatCurrent && (arrivalMessages.from === chatCurrent._id || arrivalMessages.users))
      setMessagesChatCurrent((prevState) => [...prevState, arrivalMessages]);
  }, [arrivalMessages]);

  const updateContactRecents = (fromID, content, fromSelf, users) => {
    const prevState = contacts.filter((item) => item.contact._id !== fromID);
    const updateAt = contacts.find((item) => item.contact._id === fromID);
    const newContacts = [{ ...updateAt, content: content, fromSelf: fromSelf, users }, ...prevState];
    // console.log(newContacts);
    dispatch(updateNewRecentContacts(newContacts));
  };
  // console.log(contacts);
  return (
    <div>
      {authSelect.isAuthenticated && (
        <div className="application d-flex vh-100 overflow-hidden" id="home">
          <Nav OptionNav={OptionNav} setOptionNav={setOptionNav} user={authSelect.user} />
          <hr />

          <Sidebar
            setChatCurrent={setChatCurrent}
            OptionNav={OptionNav}
            user={authSelect.user}
            setMessages={setMessagesChatCurrent}
            socket={socket}
            setSendFileMessage={setSendFileMessage}
            setArrivalMessages={setArrivalMessages}
            updateContactRecents={updateContactRecents}
          />

          {chatCurrent ? (
            <div style={{ width: '100%' }}>
              {' '}
              <div style={{ height: '85%' }}>
                <ChatContainer socket={socket} chatCurrent={chatCurrent} messages={messagesChatCurrent} setMessages={setMessagesChatCurrent} user={authSelect.user} />
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
