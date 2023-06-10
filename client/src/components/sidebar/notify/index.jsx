import React, { useEffect } from 'react';
import { axiosPrivate } from '../../../api/axios';

function Notify() {
  const [notify, setNotify] = React.useState([]);
  useEffect(() => {
    const getAllNotifications = async () => {
      try {
        const response = await axiosPrivate.get('/notifi', { params: { p: 1 } });
        setNotify(response.data);
      } catch (error) {
        console.log(error);
      }
    };
    getAllNotifications();
  }, []);
  return (
    <div>
      <div>
        {notify.map((item) => (
          <div key={item.id}>
            <div className="d-flex">
              <div>
                <img src={item.avatar} alt="" />
              </div>
              <div>
                <span className="font-weight-bold">{item.user}</span>
                {item.content}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notify;
