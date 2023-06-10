import React from 'react';
import clsx from 'clsx';
import style from '../style.module.scss';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
function Contact({ setChatCurrent, myContacts, setMessages }) {
  const axiosPrivate = useAxiosPrivate();
  // console.log(filterContacts);
  const handleSetChatCurrent = async (chatCurrent) => {
    try {
      setMessages([]);
      const getRecentMessages = async () => {
        const getMessages = await axiosPrivate.get(`/getMessages`, { params: { u: chatCurrent._id, p: 0 } });
        setMessages(
          getMessages.data.map((msg) => {
            return { fromSelf: msg.from !== chatCurrent._id, message: msg.message };
          }),
        );
      };
      getRecentMessages();
      setChatCurrent(chatCurrent);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      {myContacts.map((item) => (
        <div key={item._id} className={clsx(style.friendBtn, 'p-3')} onClick={() => handleSetChatCurrent(item.contact)}>
          <div className="d-flex ">
            <div>
              <img src={item.contact ? item.contact.avatar : item.avatar} className={style.avatar} alt="" />
            </div>
            <div className={clsx('text-light', 'd-flex', 'pt-2', 'px-2')}>{item.contact ? item.contact.userName : item.name}</div>
            <div className="text-secondary p-2" style={{ marginLeft: 40 }}>
              {item.contact && !item.contact.isFriend && 'Người lạ'}
            </div>
          </div>
          {item.contact && (
            <div className="d-flex text-light" style={{ marginLeft: 10, marginTop: 10 }}>
              {item.fromSelf ? <span>Bạn: </span> : <span>{item.contact.userName.split(' ')[1]}: </span>}
              <p style={{ marginLeft: 5 }}>{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default React.memo(Contact);
