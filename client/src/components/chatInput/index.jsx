import React, { useEffect, useState } from 'react';
import clsx from 'clsx';
import EmojiPicker from 'emoji-picker-react';
import useSocket from '../../hooks/useSocket';
import { BsEmojiSmile } from 'react-icons/bs';
import { FcLike } from 'react-icons/fc';
import { TbBrandTelegram } from 'react-icons/tb';
import style from './style.module.scss';
import ChatInputSecond from './chatInputSecond';
function ChatInput({ updateContactRecents, chatCurrent, user, setMessagesChatCurrent }) {
  const [showEnojiPicker, setShowEmojiPicker] = useState(false);

  const [messageInput, setMessageInput] = useState('');
  const [imgaeSend, setImgaeSend] = useState(null);

  const socket = useSocket();

  useEffect(() => {
    if (imgaeSend) {
      socket.current.emit('send-image', { from: user._id, to: chatCurrent._id, content: imgaeSend });
      updateContactRecents(chatCurrent._id, 'Đã gửi một ảnh', true);
      // setImgaeSend(undefined);
      return () => {
        setImgaeSend(undefined);
      };
    }
  }, [imgaeSend]);
  useEffect(() => {
    setMessageInput('');
  }, [chatCurrent]);

  const handleEmojiClick = (event, EmojiClickData) => {
    let message = messageInput;
    message += EmojiClickData.emoji;
    setMessageInput(message);
  };

  const sendSticker = (stickerItem) => {
    socket.current.emit('send-sticker', { from: user._id, to: chatCurrent._id, content: stickerItem.url });
    updateContactRecents(chatCurrent._id, 'Đã gửi một Sticker', true);
    setMessagesChatCurrent((prevState) => [...prevState, { fromSelf: true, message: { type: 'sticker', content: stickerItem.url } }]);
  };

  const sendTextChat = (event) => {
    event.preventDefault();

    if (messageInput.length > 0) {
      let message = {
        from: user._id,
        message: { type: 'text', content: messageInput },
        to: chatCurrent._id,
      };
      socket.current.emit('send-msg', message);
      setMessagesChatCurrent((prevState) => [...prevState, { fromSelf: true, message: { type: 'text', content: messageInput } }]);
      updateContactRecents(chatCurrent._id, messageInput, true);
      setMessageInput('');
    }
    setShowEmojiPicker(false);
  };

  return (
    <div className="" style={{ width: '100%' }}>
      <div>
        <ChatInputSecond setImgaeSend={setImgaeSend} handleEmojiClick={handleEmojiClick} sendSticker={sendSticker} />
        {/* <hr style={{ margin: 0 }} /> */}
        <div className="input-group mb-3 position-relative" style={{ backgroundColor: '#19123b', padding: 6 }}>
          <form onSubmit={sendTextChat} id="form-input" className="w-100 d-flex">
            <input
              type="text"
              name=""
              className={clsx('form-control', 'h-100', 'border-0', style.inputStyle, 'pb-0', 'font-size-18')}
              value={messageInput}
              onChange={(e) => {
                setMessageInput(e.target.value);
              }}
            />
            <div
              className={clsx('btn', 'px-3', style.btnInput, 'font-size-25')}
              onClick={() => {
                setShowEmojiPicker(!showEnojiPicker);
              }}
            >
              <BsEmojiSmile />
            </div>
            <div
              className={clsx('btn', 'px-3', style.btnInput, 'font-size-25')}
              onClick={() => {
                sendSticker({ url: 'https://media.tenor.com/iJk3187_NpgAAAAi/heart.gif' });
              }}
            >
              <FcLike />
            </div>
            <button type="submit" form="form-input" className={clsx('btn', 'px-3', style.btnSubmit, 'font-size-25')}>
              <TbBrandTelegram />
            </button>
          </form>
        </div>
        {showEnojiPicker && (
          <div className="position-absolute" style={{ bottom: '10%', right: 0 }}>
            <EmojiPicker onEmojiClick={handleEmojiClick} />
          </div>
        )}
      </div>
    </div>
  );
}

export default ChatInput;
