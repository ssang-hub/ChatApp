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
import { setFriends, setRecentContacts } from '../../store/reducers/contacts.slice';
import { contactSearchSelector } from '../../store/selectors';
function Sidebar({ setChatCurrent, OptionNav, user, setMessages, setMessagesLoading }) {
  // const [myFriends, setMyFriends] = useState([]);

  const dispatch = useDispatch();
  const axiosPrivate = useAxiosPrivate();
  const myContacts = useSelector(contactSearchSelector);

  useEffect(() => {
    const getFriends = async () => {
      try {
        const { data } = await axiosPrivate.get('/getContacts');
        const friendsResponse = await axiosPrivate.get('/getAllFriend');
        dispatch(setRecentContacts(data));
        dispatch(setFriends(friendsResponse.data));
      } catch (error) {
        console.log(error);
      }
    };
    getFriends();
  }, []);

  return (
    <div className="border-end border-secondary scrollbar-primary" style={{ maxWidth: '18%', overflow: 'auto', height: '100%' }}>
      <Header dispatch={dispatch} />
      {OptionNav === 'chat' && <Contact setChatCurrent={setChatCurrent} setMessagesLoading={setMessagesLoading} myContacts={myContacts} setMessages={setMessages} />}
      {OptionNav === 'friend' && <FriendRequest />}
      {OptionNav === 'notify' && <Notify />}
      {OptionNav === 'setting' && <Setting />}

      <AddFriend user={user} />
      <AddGroup user={user} />
    </div>
  );
}

export default React.memo(Sidebar);
