import React from "react";

function Setting() {
  return (
    <div className="modal fade" id="settingContainer" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex={-1} aria-labelledby="vAddGroupContainer" aria-hidden="true">
      <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
        <div className="modal-content">
          <div className="modal-header">
            <h1 className="modal-title fs-5">Tạo Nhóm</h1>
            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div className="modal-body">
            <input className="form-control" type="text" placeholder="Nhập tên nhóm" />
            <div></div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
              Close
            </button>
            <button type="button" className="btn btn-primary">
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting;
