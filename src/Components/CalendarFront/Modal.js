import React, { useState } from 'react';
import Modal from 'react-modal';

function EventModal() {
  const [modalIsOpen, setIsOpen] = useState(false);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  return (
    <Modal
      isOpen={modalIsOpen}
      onRequestClose={closeModal}
      contentLabel="Course Details"
      className="course-modal"
      overlayClassName="course-modal-overlay"
      ariaHideApp={false}
    >
      <div className="course-modal-wrap">
        <div className="modal-header">
          <h3>Event Details</h3>
          <button className="modal-close-x" onClick={closeModal}>
            X
          </button>
        </div>
        <div className="modal-body">
          <div className="modal-body-left">
            <label htmlFor="course-title">
              Course
              <input type="text" id="course-title" value={event.courseTitle} />
            </label>
            <label htmlFor="course-id">
              Course ID
              <input type="text" id="course-id" value={event.classId} />
            </label>
            <label htmlFor="instructor">
              Instructor
              <input type="text" id="instructor" value={event.instructor} />
            </label>
            <label htmlFor="location">
              Location
              <input type="text" id="location" value={event.location} />
            </label>
          </div>
          <div className="modal-body-right">
            <label htmlFor="credit-hours">
              Credit Hours
              <input type="text" id="credit-hours" value={event.creditHours} />
            </label>
            <label htmlFor="block">
              Block
              <input type="text" id="block" value={event.block} />
            </label>
            <p>Meeting Pattern: {event.meetingPattern}</p>
          </div>
        </div>
        <div className="modal-btns">
          <button className="cancel-btn">CANCEL</button>
          <button className="save-btn">SAVE</button>
        </div>
      </div>
    </Modal>
  );
}
