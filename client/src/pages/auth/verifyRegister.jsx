import React, { useState } from "react";
import { axiosPrivate } from "../../api/axios";

function VerifyRegister({}) {
  const [numberCode, setNumberCode] = useState("");
  // const handleVerifyAccount = async () => {
  //   try {
  //     const result = await axiosPrivate.post("/verifyRegister", { userPedding, numberCode });
  //     if (result.data) {
  //       // console.log("ok");
  //       toastifySuccess();
  //       setUserPedding(false);
  //     }
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };
  return (
    <div
      className="modal fade show"
      id="UserConfirm"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabIndex={-1}
      aria-labelledby="UserConfirmLabel"
      aria-hidden="true"
      style={{ display: "block" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h4 className="modal-title" id="UserConfirmLabel">
              Xác thực tài khoản
            </h4>
          </div>
          <div className="modal-body">
            <div className="container height-100 d-flex justify-content-center align-items-center">
              <div className="position-relative">
                <div className="card p-2 text-center border-0">
                  <h5>Vui lòng nhập mã đã được gửi đến email của bạn</h5>

                  <div id="otp" className="inputs d-flex flex-row justify-content-center mt-2">
                    <input
                      className="m-2 text-center form-control rounded py-3"
                      style={{ fontSize: 20, width: "40%" }}
                      value={numberCode}
                      type="number"
                      maxLength={6}
                      onChange={(e) => {
                        setNumberCode(e.target.value);
                      }}
                      placeholder="000000"
                      required
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      type="submit"
                      className="btn btn-danger px-4 py-2 validate"
                      onClick={() => {
                        // handleVerifyAccount();
                      }}
                    >
                      Xác thực
                    </button>{" "}
                  </div>
                </div>
                <div>
                  {" "}
                  <span>
                    <a href="">Bạn chưa nhận được mã ?</a>
                  </span>{" "}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VerifyRegister;
