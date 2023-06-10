import React, { memo, useEffect, useRef, useState } from 'react';
import Header from './header';
// import style from './style.module.scss';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

function ChatContainer({ socketCurrent, chatCurrent, messages, user, setMessages }) {
  const myContainerRef = useRef(null);
  const [numberPage, setNumberPage] = useState(0);
  const axiosPrivate = useAxiosPrivate();

  const handleScroll = (event) => {
    if (event.target.scrollTop === 0) {
      setNumberPage((prevState) => prevState + 1);
    }
  };
  useEffect(() => {
    const myContainer = myContainerRef.current;
    myContainer.addEventListener('scroll', handleScroll);
    setNumberPage(1);
    return () => {
      myContainer.removeEventListener('scroll', handleScroll);
    };
  }, [chatCurrent]);

  useEffect(() => {
    const getNewMessages = async () => {
      if (numberPage > 0) {
        try {
          // console.log('Call api');
          const getMessages = await axiosPrivate.get(`/getMessages`, { params: { u: chatCurrent._id, p: numberPage } });
          if (getMessages.data.length === 0) {
            myContainerRef.current.removeEventListener('scroll', handleScroll);
          } else {
            setMessages((prevState) => {
              const olderMessage = getMessages.data.map((msg) => {
                return { fromSelf: msg.from !== chatCurrent._id, message: msg.message };
              });
              return olderMessage.concat(prevState);
            });
          }
        } catch (error) {
          console.log(error);
        }
      }
    };
    getNewMessages();
  }, [numberPage]);

  useEffect(() => {
    const objDiv = document.getElementById('scroll-content');
    objDiv.scrollTop = objDiv.scrollHeight;
  }, [messages]);
  return (
    <div className="chat-container h-100">
      <div>
        <Header chatCurrent={chatCurrent} user={user} />
      </div>
      <div ref={myContainerRef} className="content text-light p-4 scrollbar-primary" id="scroll-content" style={{ overflow: 'auto', height: '87%' }}>
        {messages.length === 0 && <div class="spinner-border text-light" role="status"></div>}
        {messages.map((message, index) => (
          <div className="my-2" key={index}>
            {message.fromSelf ? (
              <div className="d-flex flex-row justify-content-end">
                <div>
                  {message.message.type === 'image' && <img src={message.message.content} style={{ width: 400, marginLeft: 10 }} />}
                  {message.message.type === 'text' && (
                    <p className="small p-3 me-3 mb-1 text-white rounded-3 bg-primary font-size-16" style={{ backgroundColor: '#f5f6f7' }}>
                      {message.message.content}
                    </p>
                  )}
                  <p className="small me-3 mb-3 rounded-3 text-muted">{message.createdAt}</p>
                </div>

                <img src={user.avatar} alt="avatar 1" style={{ width: 45, height: '100%', borderRadius: '50%' }} />
              </div>
            ) : (
              <div className="d-flex flex-row justify-content-start">
                <img src={chatCurrent.avatar} alt="avatar 1" style={{ width: 45, height: '100%', borderRadius: '50%' }} />
                <div>
                  {message.message.type === 'image' && <img src={message.message.content} style={{ maxWidth: 400, marginLeft: 10 }} />}
                  {message.message.type === 'text' && (
                    <p className="small p-2 ms-3 mb-1 rounded-3 text-dark" style={{ backgroundColor: '#f5f6f7' }}>
                      {message.message.content}
                    </p>
                  )}

                  <p className="small mb-3 rounded-3 text-muted float-end w-100">{message.createdAt}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default memo(ChatContainer);
