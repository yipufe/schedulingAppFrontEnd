import React, { useState } from 'react';
import './calendar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileExport,
  faPrint,
  faPlusCircle,
  faCheck,
  faBalanceScale,
  faArrowCircleLeft,
} from '@fortawesome/free-solid-svg-icons';
import Modal from 'react-modal';
import AddClass from '../AddClass/AddClass';

import CalendarCells from '../CalendarCells/CalendarCells';
import CalendarTimes from '../CalendarTimes/CalendarTimes';
import CalendarFront from '../CalendarFront/CalendarFront';

// This component is the parent Calendar component that houses all of the other component for the calendar like the rows and columns and the times.

function Calendar(props) {
  const [openAddClassModal, setOpenAddClassModal] = useState(false);
  const [addClassData, setAddClassData] = useState({});
  const [addClassSuccess, setAddClassSuccess] = useState(false);
  const [compareSchedule, setCompareSchedule] = useState(false);

  const handleAddClass = (e) => {
    setAddClassData({
      ...addClassData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="calendar-wrap">
      <section className="calendar-header">
      {compareSchedule && <div className="comparison-legend"><div className="legend-left-container"><span className="legend-left">Left</span> - Original Schedule</div><div className="legend-right-container"><span className="legend-right">Right</span> - Modified Schedule</div></div> }
      {compareSchedule&&
          <div
          className="calendar-header-icon-wrap"
          onClick={()=>{setCompareSchedule(false)}}
        >
          <FontAwesomeIcon
            icon={faArrowCircleLeft}
            className="calendar-header-icon"
            size="lg"
          />
          <p>Back</p>
        </div>
      }
        <div
          className="calendar-header-icon-wrap"
          onClick={() => setOpenAddClassModal(openAddClassModal ? false : true)}
        >
          <FontAwesomeIcon
            icon={faPlusCircle}
            className="calendar-header-icon"
            size="lg"
          />
          <p>Add Class</p>
        </div>
      {!compareSchedule&&
          <div
          className="calendar-header-icon-wrap"
          onClick={()=>{setCompareSchedule(true)}}
        >
          <FontAwesomeIcon
            icon={faBalanceScale}
            className="calendar-header-icon"
            size="lg"
          />
          <p>Compare</p>
        </div>    
      }
        <div className="calendar-header-icon-wrap" onClick={props.handlePrint}>
          <FontAwesomeIcon
            icon={faPrint}
            className="calendar-header-icon"
            size="lg"
          />
          <p>Print</p>
        </div>
      {!compareSchedule &&
        <div
          className="calendar-header-icon-wrap"
          onClick={props.handleExcelExport}
        >
          <FontAwesomeIcon
            icon={faFileExport}
            className="calendar-header-icon"
            size="lg"
          />
          <p>Export</p>
        </div>
      }
      </section>
      <div className="calendar">
        <div className="dayname-row">
          <div className="dayname-left"></div>
          <div className="dayname-wrap">
            <div className="dayname">Monday</div>
            <div className="dayname">Tuesday</div>
            <div className="dayname">Wednesday</div>
            <div className="dayname">Thursday</div>
            <div className="dayname">Friday</div>
            <div className="dayname">Saturday</div>
          </div>
        </div>
        <div className="full-cal">
          <CalendarTimes />
          <div className="full-cal-body">
            <CalendarCells />
            <CalendarFront
              initialData={props.initialData}
              initialDataFiltered={props.initialDataFiltered}
              setInitialData={props.setInitialData}
              displayData={props.displayData}
              setDisplayData={props.setDisplayData}
              initialAndChangedData={props.initialAndChangedData}
              setInitialAndChangedData={props.setInitialAndChangedData}
              openClassModal={props.openClassModal}
              compareSchedule={compareSchedule}
            />
          </div>
        </div>
      </div>
      {/* ** MODAL ***/}
      <Modal
        isOpen={openAddClassModal}
        contentLabel="onRequestClose Example"
        onRequestClose={() => setOpenAddClassModal(false)}
        shouldCloseOnOverlayClick={false}
        style={{ display: 'flex' }}
        className="add-class-modal"
        ariaHideApp={false}
      >
        {!addClassSuccess ? (
          <AddClass
            handleAddClass={handleAddClass}
            addClassData={addClassData}
            setOpenAddClassModal={setOpenAddClassModal}
            setScheduleChangesData={props.setScheduleChangesData}
            scheduleChangesData={props.scheduleChangesData}
            setAddClassData={setAddClassData}
            initialAndChangedData={props.initialAndChangedData}
            setInitialAndChangedData={props.setInitialAndChangedData}
            setAddClassSuccess={setAddClassSuccess}
          />
        ) : (
          <div
            className="add-class-modal-wrap"
            style={{ height: '400px', justifyContent: 'center' }}
          >
            <FontAwesomeIcon
              icon={faCheck}
              className="calendar-header-icon"
              size="6x"
              style={{ color: '#275d38' }}
            />
            <h2 className="add-class-success-h2">Class Added Successfully!</h2>
            <button
              className="add-class-success-btn"
              onClick={() => {
                setOpenAddClassModal(false);
                setAddClassSuccess(false);
              }}
            >
              Fantastic!
            </button>
          </div>
        )}
      </Modal>
      {/*** MODAL END **/}
    </div>
  );
}

export default Calendar;
