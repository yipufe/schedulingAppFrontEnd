import React, { useState } from 'react';
import './sidebar.scss';
import Select from 'react-select';
import Modal from 'react-modal';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faExclamationTriangle,
} from '@fortawesome/free-solid-svg-icons';

function Sidebar(props) {
  const [openClearCalendarModal, setOpenClearCalendarModal] = useState(false);

  return (
    <div className="sidebar">
      <h1>Academic Scheduling Aid</h1>
      <div className="btns">
        <input
          type="file"
          name="csvfile"
          id="csvfile"
          onChange={props.handleChange}
          style={{
            width: '100%',
            height: '30px',
            fontSize: '10pt',
          }}
        />
        <button
          type="submit"
          onClick={props.fileHandler}
          className="upload-btn"
        >
          IMPORT CALENDAR FILE
        </button>
      </div>
      <div className="filters">
        <div className="filter-header">
          <h3>Filter by</h3>
          <button onClick={props.clearFilters} className="clear-filters-btn">
            Clear All
          </button>
        </div>
        <Select
          className="select"
          placeholder="Filter Course..."
          value={props.courseValue}
          options={props.course}
          onChange={props.handleCourseChange}
        />
        <Select
          className="select"
          placeholder="Filter Room..."
          value={props.roomValue}
          options={props.room}
          onChange={props.handleRoomChange}
        />
        <Select
          className="select"
          placeholder="Filter Instructor..."
          value={props.instructorValue}
          options={props.instructor}
          onChange={props.handleInstructorChange}
        />
        <Select
          className="select"
          placeholder="Filter Block..."
          value={props.blockValue}
          options={props.block}
          onChange={props.handleBlockChange}
        />
      </div>
      <button
        className="reset-calendar"
        onClick={() => setOpenClearCalendarModal(true)}
      >
        RESET CALENDAR
      </button>
      {/* ** MODAL ***/}
      <Modal
        isOpen={openClearCalendarModal}
        contentLabel="onRequestClose Example"
        onRequestClose={() => setOpenClearCalendarModal(false)}
        shouldCloseOnOverlayClick={false}
        style={{ display: 'flex' }}
        className="clear-calendar-modal"
        ariaHideApp={false}
      >
        <div className="clear-calendar-modal-body">
          <h3>Are you sure you want to clear the calendar?</h3>
          <p>
            This will clear all data that was uploaded from the CSV file and any
            changes you made.
          </p>
          <div className="clear-calendar-modal-btns">
            <button
              className="clear-calendar-cancel-btn"
              onClick={() => setOpenClearCalendarModal(false)}
            >
              Cancel
            </button>
            <button
              className="clear-calendar-clear-btn"
              onClick={() => {
                props.handleResetCalendar();
                document.getElementById('csvfile').value = '';
                setOpenClearCalendarModal(false);
              }}
            >
              Clear Calendar
            </button>
          </div>
        </div>
      </Modal>
      {/*** MODAL END **/}


      {props.collisions.length > 0 &&
        <div className="warningsLog">
          <p className="warningsLogTitle">Overlapping Schedules</p>
          <div className="warningsLogContainer">
          {props.collisions.map(warning=>{
            return (
            <div className="warningMsg">            
              <FontAwesomeIcon
                icon={faExclamationTriangle}
                className="warningIcon"
                size="lg"
              />
              {warning[0].collisionAt[0].toUpperCase()+warning[0].collisionAt.substring(1)+": "} 
              {warning[0][warning[0].collisionAt]}<br/>
              Overlapping Times: 
              {warning.map(item=>{
                return (
                  " "+item.meetingPattern+","
                );
              })}
            </div>
            );
          })}
          </div>
        </div>
      }

    </div>
  );
}

export default Sidebar;
