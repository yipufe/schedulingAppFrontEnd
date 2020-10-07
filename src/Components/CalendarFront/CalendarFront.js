import React from 'react';
import './calendarFront.scss';
import styled from 'styled-components';
import { calDays, calDaysLeft, calDaysRight, calTimes, colors } from '../../calendarDaysAndTimesData';
import { getTimeRange } from '../../time';
import ReactTooltip from 'react-tooltip';

const Container = styled.div`
  width: 85%;
  background-color: ${(props) => colors[props.index]};  //color lookup
  color: black;
  border-radius: 5px;
  padding: 5px;
  cursor: pointer;
`;

const ContainerChange = styled.div`
  width: 85%;
  background-color: ${(props) => colors[props.index]};  //color lookup
  color: black;
  border-radius: 5px;
  padding: 1px;
  cursor: pointer;
  border: 4px dashed #0095c8;
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

  //Filter original schedule removing classes that do not meet
  meetingPatternArrOriginal = initialDataFiltered.filter(
    (course) => course.meetingPattern !== 'Does Not Meet'
  );

  let colorsUsedOnOriginal = [];  //Array for keeping track of colors used in displaying original schedule
  let lastColorIndex = 1; //Variable to keep track of current color index
  let tooltipIndex = 1000;

  const eventDataOriginal = meetingPatternArrOriginal.map((event,index) => {
    colorsUsedOnOriginal.push({colorIndex: index, classId: event.classId});
    lastColorIndex = index;

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
      tooltipIndex++;
      return (
        <Container
          key={`${day}-${event.classId}`}
          index={index}
          style={{
            gridColumn: `${calDaysLeft[day]}`,
            gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
          }}
          data-tip
          data-for={"tooltip_"+tooltipIndex}
        >
          <p className="cal-front-item-course">
            {event.course}-{event.section}
          </p>
          <p className="cal-front-item-p">
            {event.courseTitle.substring(0, 8) + '...'}
          </p>

          { timeSpan>1.5 && <p className="cal-front-item-p">{event.meetingPattern}</p> }
          <ReactTooltip delayShow={1000} id={"tooltip_"+tooltipIndex}>
            {event.course}-{event.section}
            <br />
            {event.courseTitle}
            <br />
            {event.instructor}
            <br />
            {event.meetingPattern}
          </ReactTooltip>
        </Container>
      );
    });

    return displayEvents;
  });


  const eventData = meetingPatternArr.map((event, index) => {
    const colorUsedOnOriginalIndex = colorsUsedOnOriginal.findIndex((element)=>element.classId===event.classId)
    let colorIndex=1;
    if(colorUsedOnOriginalIndex<0)
      colorIndex=++lastColorIndex;  //if calendar item is not associated with and original calendar item and has no color, assign the next available one
    else
      colorIndex = colorsUsedOnOriginal[colorUsedOnOriginalIndex].colorIndex; //assign a color based on items original

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
      tooltipIndex++;
      if(compareSchedule) {
        if(meetingPatternArrOriginal.indexOf(event)===-1) {
          return (
            <ContainerChange
              key={`${day}-${event.classId}`}
              index={colorIndex}
              style={{
                gridColumn: compareSchedule?`${calDaysRight[day]}`:`${calDays[day]}`,
                gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
              }}
              onClick={() => {
                props.openClassModal(event.classId);
              }}
              className="cal-front-item-change"
              data-tip
              data-for={"tooltip_"+tooltipIndex}
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
              <ReactTooltip delayShow={1000} id={"tooltip_"+tooltipIndex}>
                {event.course}-{event.section}
                <br />
                {event.courseTitle}
                <br />
                {event.instructor}
                <br />
                {event.meetingPattern}
              </ReactTooltip>
            </ContainerChange>
          );    
        } else {
          return null;
        }
      } else {
        return (
          <Container
            key={`${day}-${event.classId}`}
            index={index}
            style={{
              gridColumn: compareSchedule?`${calDaysRight[day]}`:`${calDays[day]}`,
              gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
            }}
            onClick={() => {
              props.openClassModal(event.classId);
            }}
            data-tip
            data-for={"tooltip_"+tooltipIndex}
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
            <ReactTooltip delayShow={1000} id={"tooltip_"+tooltipIndex}>
              {event.course}-{event.section}
              <br />
              {event.courseTitle}
              <br />
              {event.instructor}
              <br />
              {event.meetingPattern}
            </ReactTooltip>
          </Container>
        );  
      }
      
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
