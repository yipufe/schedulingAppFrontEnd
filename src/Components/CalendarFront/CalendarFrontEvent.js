import React from 'react';
import './calendarFront.scss';
import { calDays, calTimes } from '../../calendarDaysAndTimesData';

// This is the component that CalendarFront uses for each class that it maps through.

function CalendarFrontEvent(props) {
  const { startTime, endTime, event, day } = props;

  // console.log(classId);

  return (
    <div
      className="cal-front-item"
      style={{
        // Because we're using CSS Grid for the positioning of the classes we import the calDays and calTimes from calendarDaysAndTimesData.
        gridColumn: `${calDays[day]}`, // for the column we use calDays and then use bracket notation to put in the day which is then associated to a number, which is the column.
        gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`, // For the row we use calTimes and the startTime and endTime which is then associated with a number, then we tell it what row to start on with the start time and what row to end on with the end time.
      }}
      onClick={()=>{props.openClassModal(props.index)} }
    >
      <p>{event.course}</p>
      <p>{event.courseTitle.substring(0, 15) + '...'}</p>
      <p>{event.meetingPattern}</p>
    </div>
  );
}

export default CalendarFrontEvent;
