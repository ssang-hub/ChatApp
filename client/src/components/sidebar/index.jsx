import React, { useEffect, useState } from 'react';
import Header from './headerSidebar';
import AddFriend from './friends/AddFriend';
import Contact from './contact';
import AddGroup from './groups/AddGroup';
import Setting from './setting';
import Notify from './notify';
import FriendRequest from './friendRequest';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch, useSelector } from 'react-redux';
import { contactSearchSelector, RequestSelector } from '../../store/selectors';

import { setFriends, setRecentContacts } from '../../store/reducers/contacts.slice';

function Sidebar({ setChatCurrent, OptionNav, user, setMessages, socket, setArrivalMessages, setSendFileMessage, updateContactRecents }) {
  // const [myFriends, setMyFriends] = useState([]);

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const myContacts = useSelector(contactSearchSelector);
  const RequestSelect = useSelector(RequestSelector);

  const [socketContactState, setSocketContactState] = useState(false);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const { data } = await axiosPrivate.get('/getContacts');
        const friendsResponse = await axiosPrivate.get('/getAllFriend');
        dispatch(setRecentContacts(data));
        dispatch(setFriends(friendsResponse.data));
        setSocketContactState(true);
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, []);
  useEffect(() => {
    if (socketContactState) {
      socket.current.on('msg-recieve', (msg) => {
        setTheLastMessage(msg);
        console.log(msg);
        updateContactRecents(msg.userGroup ? msg.to : msg.from, msg.message.content, false, msg.userGroup);
      });

      socket.current.on('image-receive', (msg) => {
        setTheLastMessage(msg);
        updateContactRecents(msg.from, 'Đã gửi một ảnh', false, msg.userGroup);
      });
      socket.current.on('sticker-receive', (msg) => {
        setTheLastMessage(msg);
        updateContactRecents(msg.from, 'Đã gửi một sticker', false, msg.userGroup);
      });
      socket.current.on('send-image-success', (msg) => {
        const msgSend = { fromSelf: true, message: msg.message };
        setSendFileMessage(msgSend);
      });
    }
  }, [socketContactState]);

  const setTheLastMessage = (msg) => {
    setArrivalMessages({ fromSelf: false, message: msg.message, from: msg.from, users: msg.userGroup, createdAt: msg.createdAt });
  };

  return (
    <div className="border-end border-secondary scrollbar-primary" style={{ maxWidth: '18%', overflow: 'auto', height: '100%' }}>
      <Header dispatch={dispatch} />
      {OptionNav === 'chat' && <Contact setChatCurrent={setChatCurrent} user={user} myContacts={myContacts} setMessages={setMessages} />}
      {OptionNav === 'friend' && <FriendRequest />}
      {OptionNav === 'notify' && <Notify />}
      {OptionNav === 'setting' && <Setting />}

      <AddFriend user={user} />
      <AddGroup user={user} />
    </div>
  );
}

export default React.memo(Sidebar);
