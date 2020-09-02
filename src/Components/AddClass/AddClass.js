import React, { useState } from 'react';
import './addClass.scss';
import Select from 'react-select';
import { selectDays, selectTimes } from '../../calendarDaysAndTimesData';
// import { isCompositeComponent } from 'react-dom/test-utils';

export default function AddClass(props) {
  const { initialAndChangedData, setInitialAndChangedData } = props;
  const [schedule, setSchedule] = useState('');
  const [addClassFormError, setAddClassFormError] = useState(false);

  const {
    handleAddClass,
    addClassData,
    setOpenAddClassModal,
    setAddClassData,
    setAddClassSuccess,
  } = props;

  const handleSetDays = (selected) => {
    setSchedule(selected.value);
  };
  const handleSetStartTime = (selected) => {
    setSchedule(schedule.split(' ')[0] + ' ' + selected.value);
  };
  const handleSetEndTime = (selected) => {
    setAddClassData({
      ...addClassData,
      meetingPattern: schedule.includes('-')
        ? schedule.split('-')[0] + '-' + selected.value
        : schedule + '-' + selected.value,
    });
  };

  //Same room at same time error checking
  const allTimes = []
  const timeObj = () => {
    //Location
    let locations = initialAndChangedData.map(obj => {
      let joinLocation = obj.location.split(' ').join('').toLowerCase()
      let filterSemi = joinLocation.split(';')
      let filterJoins = filterSemi[0]

      return filterJoins
    })

    //START TIMES
    initialAndChangedData.forEach((obj, index) => {
      let splitTime = obj.meetingPattern.split('-')
      let splitDays = splitTime[0].split(' ')
      let combinedDaysTime = splitDays.concat(splitTime[1])
      

      const weekDays =  splitDays[0].toLowerCase()


      combinedDaysTime.shift()

      let formattedArr = []
      combinedDaysTime.forEach(time => {
        if(time && time.length){
          if(time.length <= 4){
            let splitTime = time.split('')
            if(splitTime.length === 4){
              splitTime.splice(2, 0, ':00')
              let joinedTime = splitTime.join('')
              formattedArr.push(joinedTime)
            }else {
              splitTime.splice(1, 0, ':00')
              let joinedTime = splitTime.join('')
              formattedArr.push(joinedTime)
            }
          }if(time.length > 4){
            formattedArr.push(time)
          }
        }
      })

      let firstFormat = formattedArr[0]
      let spaceFirstAP = firstFormat.split('')
      spaceFirstAP.splice(-2, 0, " ")
      let joinedFirstAP = spaceFirstAP.join('')


      let secondFormat = formattedArr[1]
      let spaceSecondAP = secondFormat.split('')
      spaceSecondAP.splice(-2, 0, " ")
      let joinedSecondAP = spaceSecondAP.join('')


      let arbitraryDate = '2020/01/01 '
      let start = arbitraryDate.concat(joinedFirstAP)
      let end = arbitraryDate.concat(joinedSecondAP)


      let startDate = new Date(Date.parse(start))
      let endDate = new Date(Date.parse(end))

      allTimes.push({
        location: locations[index],
        startTime: startDate,
        endTime: endDate,
        days: weekDays
      })

  })
    
  }
  timeObj()


  //New added class selection to an object
  const addClassObj = (str) => {

    let splitTime = str.split('-')
    let splitDays = splitTime[0].split(' ')
    let combinedDaysTime = splitDays.concat(splitTime[1])

    const weekDays =  splitDays[0].toLowerCase()

    combinedDaysTime.shift()

    let formattedArr = []
    combinedDaysTime.forEach(time => {
      if(time && time.length){
        if(time.length <= 4){
          let splitTime = time.split('')
          if(splitTime.length === 4){
            splitTime.splice(2, 0, ':00')
            let joinedTime = splitTime.join('')
            formattedArr.push(joinedTime)
          }else {
            splitTime.splice(1, 0, ':00')
            let joinedTime = splitTime.join('')
            formattedArr.push(joinedTime)
          }
        }if(time.length > 4){
          formattedArr.push(time)
        }
      }
    })

    let firstFormat = formattedArr[0]
    let spaceFirstAP = firstFormat.split('')
    spaceFirstAP.splice(-2, 0, " ")
    let joinedFirstAP = spaceFirstAP.join('')


    let secondFormat = formattedArr[1]
    let spaceSecondAP = secondFormat.split('')
    spaceSecondAP.splice(-2, 0, " ")
    let joinedSecondAP = spaceSecondAP.join('')


    let arbitraryDate = '2020/01/01 '
    let start = arbitraryDate.concat(joinedFirstAP)
    let end = arbitraryDate.concat(joinedSecondAP)


    let startDate = new Date(Date.parse(start))
    let endDate = new Date(Date.parse(end))

    return({
      startTime: startDate,
      endTime: endDate,
      days: weekDays
    })
}

  //final error check
  const checkConflicts = () => {
    let conflict = false
    let newLocation = addClassData.location.split(' ').join('').toLowerCase()
    let filterNewSemi = newLocation.split(';')
    let filterNewLocation = filterNewSemi[0]

    let ourNewAddedTime = addClassObj(addClassData.meetingPattern)
    let daysFiltered = ourNewAddedTime.days.split('').sort()

    allTimes.forEach(obj => {
      if(obj.location === filterNewLocation) {
        if(daysFiltered.includes(obj.days.split('').sort()[0]) || daysFiltered.includes(obj.days.split('').sort()[1]) || daysFiltered.includes(obj.days.split('').sort()[2])){
          if(obj.startTime < ourNewAddedTime.startTime && obj.endTime < ourNewAddedTime.startTime){
          }else if(obj.startTime > ourNewAddedTime.endTime && obj.endTime > ourNewAddedTime.endTime){
          }else{
            return conflict = true
          }
        }
      }

    })
    //close the modal and check for form errors
    if(conflict === true) {
      alert('Room Time Conflicts') 
      return false
    }else {
      return true
    }
  }

  return (
    <div className="add-class-modal-wrap">
      <div className="add-class-modal-header">
        <h2>New Class</h2>
      </div>
      <div className="add-class-body">
        <div className="add-class-left-section">
          <h3>Section Information</h3>
          <div className="left-section-item">
            <p className="left-section-label">Prefix & Number</p>
            <input type="text" name="course" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Title</p>
            <input type="text" name="courseTitle" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Section</p>
            <input type="text" name="section" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Credit Hours</p>
            <input type="text" name="creditHours" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Status</p>
            <input type="text" name="status" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Special Approval</p>
            <input
              type="text"
              name="specialApproval"
              onChange={handleAddClass}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Grade Mode</p>
            <input type="text" name="gradeMode" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Cross List With</p>
            <input type="text" name="crossListWith" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Part of Term</p>
            <input type="text" name="block" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Campus</p>
            <input type="text" name="campus" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Instruction Method</p>
            <input
              type="text"
              name="instructionMethod"
              onChange={handleAddClass}
            />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Visable</p>
            <input type="text" name="visible" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Schedule Type</p>
            <input type="text" name="scheduleType" onChange={handleAddClass} />
          </div>
          <div className="left-section-item">
            <p className="left-section-label">Session</p>
            <input type="text" name="session" onChange={handleAddClass} />
          </div>
        </div>

        <div className="add-class-right-section">
          <div className="right-section-item">
            <h3>Section Attributes</h3>
            <input
              type="text"
              name="sectionAttributes"
              onChange={handleAddClass}
            />
          </div>
          <div className="right-section-item">
            <h3>Course Attributes</h3>
            <input
              type="text"
              name="courseAttributes"
              onChange={handleAddClass}
            />
          </div>
          <div className="right-section-item">
            <h3>Instructor</h3>
            <input
              type="text"
              placeholder="e.g. Hatch, Daniel (12345678)"
              name="instructor"
              onChange={handleAddClass}
            />
          </div>
          <div className="right-section-item">
            <h3>Building and Room</h3>
            <input
              type="text"
              placeholder="e.g. CS 406"
              name="location"
              onChange={handleAddClass}
            />
          </div>
          <div className="right-section-item">
            <h3>Schedule</h3>
            <div className="schedule-selects">
              <Select
                name="schedule-days"
                options={selectDays}
                className="schedule-select"
                placeholder="Days"
                onChange={handleSetDays}
              />
              <Select
                name="schedule-start-time"
                options={selectTimes}
                className="schedule-select"
                placeholder="Start Time"
                onChange={handleSetStartTime}
              />
              <Select
                name="schedule-end-time"
                options={selectTimes}
                className="schedule-select"
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
                  onChange={handleAddClass}
                />
              </label>
              <label htmlFor="maxWaitlistEnrollment">
                Waitlist Max.
                <input
                  type="text"
                  id="maxWaitlistEnrollment"
                  name="maxWaitlistEnrollment"
                  onChange={handleAddClass}
                />
              </label>
            </div>
          </div>
          <div className="right-section-item">
            <h3>Section Text</h3>
            <input type="text" name="sectionText" onChange={handleAddClass} />
          </div>
          <div className="right-section-item">
            <h3>Comments</h3>
            <textarea
              type="text"
              rows="3"
              name="sectionComments"
              onChange={handleAddClass}
            />
          </div>
          {addClassFormError && (
            <div className="add-class-form-error">
              ** All fields must be filled out **
            </div>
          )}
        </div>
      </div>
      <div className="add-class-btns">
        <button
          className="add-class-cancel-btn"
          onClick={() => setOpenAddClassModal(false)}
        >
          Cancel
        </button>
        <button
          className="add-class-save-btn"
          onClick={() => {
            if (checkConflicts()){
              if (Object.keys(addClassData).length === 23) {
                setInitialAndChangedData([
                  ...initialAndChangedData,
                  addClassData,
                ]);
                setAddClassSuccess(true);
                setAddClassFormError(false);
              } else {
                setAddClassFormError(true);
              }
            }
          }}
        >
          Save Section
        </button>
      </div>
    </div>
  );
}
