import React from 'react';
import './calendarFront.scss';
import styled from 'styled-components';
import { calDays, calDaysLeft, calDaysRight, calTimes, colors } from '../../calendarDaysAndTimesData';
import { getTimeRange } from '../../time';
import ReactTooltip from 'react-tooltip';

const Container = styled.div`
  width: 85%;
  background-color: ${(props) => colors[props.index]};
  color: black;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
`;

function CalendarFront(props) {
  const { initialDataFiltered ,displayData, initialAndChangedData, compareSchedule } = props; // This is filtering through the displayData and filtering out all the data that say "Does Not Meet"
  let meetingPatternArr;
  let meetingPatternArrOriginal;
  if (displayData) {
    meetingPatternArr = displayData.filter(
      (course) => course.meetingPattern !== 'Does Not Meet'
    );
  } else {
    meetingPatternArr = initialAndChangedData.filter(
      (course) => course.meetingPattern !== 'Does Not Meet'
    );
  }

  meetingPatternArrOriginal = initialDataFiltered.filter(
    (course) => course.meetingPattern !== 'Does Not Meet'
  );

  const eventData = meetingPatternArr.map((event) => {
    let days = event.meetingPattern.split(' ')[0];
    days = days.replace('a', '');
    let dayArray = days.split('');
    dayArray = dayArray.map((day) => {
      if (day === 'S') return 'Sa';
      return day;
    });

    const startTime = event.meetingPattern.split(' ')[1].split('-')[0];
    let endTime = event.meetingPattern.split(' ')[1].split('-')[1];
    if (endTime.includes(';')) {
      endTime = endTime.substring(0, endTime.length - 1);
    }

    const timeSpan = getTimeRange( startTime, endTime);

    const displayEvents = dayArray.map((day) => {
      const randValue = (Math.random()*100000)%10000;
      return (
        <Container
          key={`${day}-${event.classId}`}
          index={meetingPatternArr.indexOf(event)}
          style={{
            gridColumn: compareSchedule?`${calDaysRight[day]}`:`${calDays[day]}`,
            gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
          }}
          onClick={() => {
            props.openClassModal(event.classId);
          }}
          data-tip
          data-for={event.classId+randValue}
        >
          <p className="cal-front-item-course">
            {event.course}-{event.section}
          </p>
          {
            !compareSchedule? 
            <p className="cal-front-item-p">
              {event.courseTitle.substring(0, 15) + '...'}
            </p>:
            <p className="cal-front-item-p">
              {event.courseTitle.substring(0, 8) + '...'}
            </p>
          }
          
          { timeSpan>1.5 && <p className="cal-front-item-p">{event.meetingPattern}</p> }
          <ReactTooltip delayShow={1000} id={event.classId+randValue}>
            {event.course}-{event.section}
            <br />
            {event.courseTitle}
            <br />
            {event.meetingPattern}
          </ReactTooltip>
        </Container>
      );
    });

    return displayEvents;
  });

  const eventDataOriginal = meetingPatternArrOriginal.map((event) => {
    let days = event.meetingPattern.split(' ')[0];
    days = days.replace('a', '');
    let dayArray = days.split('');
    dayArray = dayArray.map((day) => {
      if (day === 'S') return 'Sa';
      return day;
    });

    const startTime = event.meetingPattern.split(' ')[1].split('-')[0];
    let endTime = event.meetingPattern.split(' ')[1].split('-')[1];
    if (endTime.includes(';')) {
      endTime = endTime.substring(0, endTime.length - 1);
    }

    const timeSpan = getTimeRange( startTime, endTime);

    const displayEvents = dayArray.map((day) => {
      const randValue = (Math.random()*100000)%10000;
      return (
        <div
          key={`${day}-${event.classId}`}
          index={meetingPatternArr.indexOf(event)}
          style={{
            gridColumn: `${calDaysLeft[day]}`,
            gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
          }}
          className="cal-front-item"
          data-tip
          data-for={event.classId+randValue}
        >
          <p className="cal-front-item-course">
            {event.course}-{event.section}
          </p>
          <p className="cal-front-item-p">
            {event.courseTitle.substring(0, 8) + '...'}
          </p>

          { timeSpan>1.5 && <p className="cal-front-item-p">{event.meetingPattern}</p> }
          <ReactTooltip delayShow={1000} id={event.classId+randValue}>
            {event.course}-{event.section}
            <br />
            {event.courseTitle}
            <br />
            {event.meetingPattern}
          </ReactTooltip>
        </div>
      );
    });

    return displayEvents;
  });

  if(compareSchedule) {
    return <div className="calendar-front compare">{eventData.concat(eventDataOriginal)}</div>;
  } else {
    return <div className="calendar-front">{eventData}</div>;
  }

}

export default CalendarFront;
