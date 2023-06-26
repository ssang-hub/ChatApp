import React, { useEffect, useState } from 'react';
import useAxiosPrivate from '../../../hooks/useAxiosPrivate';
import style from '../style.module.scss';
import clsx from 'clsx';
import { AiOutlineCheck } from 'react-icons/ai';
import { CiTrash } from 'react-icons/ci';

function FriendRequest() {
  const [Requests, setRequests] = useState([]);
  const axiosPrivate = useAxiosPrivate();
  useEffect(() => {
    const getRequest = async () => {
      try {
        const respones = await axiosPrivate.get('/Request', { params: { p: 1 } });
        setRequests(respones.data);
        return respones.data;
      } catch (error) {
        console.log(error);
      }
    };
    getRequest();
  }, []);
  const RequestAccept = async (Id) => {
    try {
      const response = await axiosPrivate.post(`/RequestAccept`, { id: Id });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  const refuseRequest = async (Id) => {
    try {
      const response = await axiosPrivate({ method: 'DELETE', url: 'refuseRequest', data: { id: Id } });
      if (response.status === 200) {
        window.location.reload();
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {Requests.length > 0 &&
        Requests.map((Request) => (
          <div key={Request._id}>
            <div className="d-flex text-light p-3" style={{ width: 350 }}>
              <div>
                <img className={clsx(style.avatarNotify)} src={Request.users.avatar} alt="" />
              </div>
              <div className="mx-2">
                <h5 className="font-weight-bold d-inline">{Request.users.userName} </h5>
                <div className="text-left d-inline">Đã gửi lời kết bạn cho bạn. Hãy đồng ý để trở thành bạn bè</div>
              </div>
              <div>
                <button className="btn btn-success mb-1" onClick={() => RequestAccept(Request._id)}>
                  <AiOutlineCheck />
                </button>
                <button className="btn btn-danger" onClick={() => refuseRequest(Request._id)}>
                  <CiTrash />
                </button>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default FriendRequest;
