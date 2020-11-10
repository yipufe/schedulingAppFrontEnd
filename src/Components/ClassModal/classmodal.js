import React from 'react';
import './classmodal.scss';
import { selectDays, selectTimes } from '../../calendarDaysAndTimesData';
import Select from 'react-select';

function ClassModal(props) {
  const { meetingPattern, classId } = props.classModalData;
  const [days, timeSpan] = meetingPattern.split(' '); //Get days and time span
  const [startTime12Hour, endTime12Hour] = timeSpan.split('-');

  const selectedDaysIndex = selectDays.findIndex(
    (value) => value.value === days
  );
  const selectedStartTimeIndex = selectTimes.findIndex(
    (value) => value.value === startTime12Hour
  );
  const selectedEndTimeIndex = selectTimes.findIndex(
    (value) => value.value === endTime12Hour
  );

  const handleSetDays = (selected) => {
    props.changeMeetingPattern(selected.value + ' ' + timeSpan);
  };
  const handleSetStartTime = (selected) => {
    props.changeMeetingPattern(
      days + ' ' + selected.value + '-' + endTime12Hour
    );
  };
  const handleSetEndTime = (selected) => {
    props.changeMeetingPattern(
      days + ' ' + startTime12Hour + '-' + selected.value
    );
  };

  return (
    <div className="add-class-modal-wrap">
      <div className="add-class-modal-header">
        <h2>Edit Class</h2>
      </div>
      <div className="add-class-body">
        <div className="add-class-left-section">
          <h3>Section Information</h3>
          <div className="left-section-item">
            <p className="left-section-label">Prefix & Number</p>
            <input type="text" name="course" onChange={props.changed}
              value={props.classModalData.course}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Title</p>
            <input
              type="text"
              name="courseTitle"
              onChange={props.changed}
              value={props.classModalData.courseTitle}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Section</p>
            <input
              type="text"
              name="section"
              onChange={props.changed}
              value={props.classModalData.section}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Credit Hours</p>
            <input
              type="text"
              name="creditHours"
              onChange={props.changed}
              value={props.classModalData.creditHours}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Status</p>
            <input
              type="text"
              name="status"
              onChange={props.changed}
              value={props.classModalData.status}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Special Approval</p>
            <input
              type="text"
              name="specialApproval"
              onChange={props.changed}
              value={props.classModalData.specialApproval}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Grade Mode</p>
            <input
              type="text"
              name="gradeMode"
              onChange={props.changed}
              value={props.classModalData.gradeMode}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Cross List With</p>
            <input
              type="text"
              name="crossListWith"
              onChange={props.changed}
              value={props.classModalData.crossListWith}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Part of Term</p>
            <input
              type="text"
              name="block"
              onChange={props.changed}
              value={props.classModalData.block}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Campus</p>
            <input
              type="text"
              name="campus"
              onChange={props.changed}
              value={props.classModalData.campus}
            />
          </div>
        </div>  
        <div className="add-class-center-section">
          <div className="center-section-item">
            <p className="center-section-label">Instruction Method</p>
            <input
              type="text"
              name="instructionMethod"
              onChange={props.changed}
              value={props.classModalData.instructionMethod}
            />
          </div>
          <div className="center-section-item">
            <p className="center-section-label">Visable</p>
            <input
              type="text"
              name="visible"
              onChange={props.changed}
              value={props.classModalData.visible}
            />
          </div>
          <div className="center-section-item">
            <p className="center-section-label">Schedule Type</p>
            <input
              type="text"
              name="scheduleType"
              onChange={props.changed}
              value={props.classModalData.scheduleType}
            />
          </div>
          <div className="center-section-item">
            <p className="center-section-label">Session</p>
            <input
              type="text"
              name="session"
              onChange={props.changed}
              value={props.classModalData.session}
            />
          </div>
          <div className="center-section-item">
            <h3>Instructor</h3>
            <input
              type="text"
              placeholder="e.g. Hatch, Daniel (12345678)"
              name="instructor"
              onChange={props.changed}
              value={props.classModalData.instructor}
            />
          </div>
          <div className="center-section-item">
            <h3>Building and Room</h3>
            <input
              type="text"
              placeholder="e.g. CS 406"
              name="location"
              onChange={props.changed}
              value={props.classModalData.location}
            />
          </div>
        </div>

        <div className="add-class-right-section">
          <div className="right-section-item">
            <h3>Section Attributes</h3>
            <input
              type="text"
              name="sectionAttributes"
              onChange={props.changed}
              value={props.classModalData.sectionAttributes}
            />
          </div>
          <div className="right-section-item">
            <h3>Course Attributes</h3>
            <input
              type="text"
              name="courseAttributes"
              onChange={props.changed}
              value={props.classModalData.courseAttributes}
            />
          </div>
          <div className="right-section-item">
            <h3>Schedule</h3>
            <div className="schedule-selects">
              <Select
                name="schedule-days"
                options={selectDays}
                defaultValue={selectDays[selectedDaysIndex]}
                className="schedule-select"
                placeholder="Days"
                onChange={handleSetDays}
              />
              <Select
                name="schedule-start-time"
                options={selectTimes}
                className="schedule-select"
                defaultValue={selectTimes[selectedStartTimeIndex]}
                placeholder="Start Time"
                onChange={handleSetStartTime}
              />
              <Select
                name="schedule-end-time"
                options={selectTimes}
                className="schedule-select"
                defaultValue={selectTimes[selectedEndTimeIndex]}
                placeholder="End Time"
                onChange={handleSetEndTime}
              />
            </div>
          </div>
          <div className="right-section-item">
            <h3>Enrollment</h3>
            <div className="enrollment-section">
              <label htmlFor="maxEnrollment">
                Maximum
                <input
                  type="text"
                  id="maxEnrollment"
                  name="maxEnrollment"
                  onChange={props.changed}
                  value={props.classModalData.maxEnrollment}
                />
              </label>
              <label htmlFor="maxWaitlistEnrollment">
                Waitlist Max.
                <input
                  type="text"
                  id="maxWaitlistEnrollment"
                  name="maxWaitlistEnrollment"
                  onChange={props.changed}
                  value={props.classModalData.maxWaitlistEnrollment}
                />
              </label>
            </div>
          </div>
          <div className="right-section-item">
            <h3>Section Text</h3>
            <input
              type="text"
              name="sectionText"
              onChange={props.changed}
              value={props.classModalData.sectionText}
            />
          </div>
          <div className="right-section-item">
            <h3>Comments</h3>
            <textarea
              type="text"
              rows="3"
              name="sectionComments"
              onChange={props.changed}
              value={props.classModalData.sectionComments}
            />
          </div>
          {/* {addClassFormError && (
              <div className="add-class-form-error">
                ** All fields must be filled out **
              </div>
            )} */}
        </div>
      </div>
      <div
        className="add-class-btns"
        style={{ justifyContent: 'space-between' }}
      >
        <div>
          <button
            className="red-btn delete-btn-left"
            onClick={() => {
              props.deleteClass(classId);
            }}
          >
            Delete Course
          </button>
        </div>
        <div>
          <button
            className="add-class-cancel-btn"
            onClick={props.closeClassModal}
          >
            Cancel
          </button>
          <button
            className="add-class-save-btn"
            onClick={() => {
              props.saveClass(classId);
            }}
          >
            Save Section
          </button>
        </div>
      </div>
    </div>
  );
}

export default ClassModal;
