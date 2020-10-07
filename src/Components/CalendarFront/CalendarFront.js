import React from 'react';
import './calendarFront.scss';
import styled from 'styled-components';
import { calDays, calDaysLeft, calDaysRight, calTimes, colors } from '../../calendarDaysAndTimesData';
import { getTimeRange, getTimeValue, meetingPatternsOverlap } from '../../time';
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

const ContainerCollision = styled.div`
  width: 85%;
  background-color: white;
  color: black;
  border-radius: 5px;
  padding: 1px;
  cursor: pointer;
  border: 4px dashed #ff0000;
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

  //OVERLAP section
  let overlap = [];
  meetingPatternArr.forEach((calItem,i,calItemArr)=>{
    const arrCopy = JSON.parse(JSON.stringify(calItemArr));
    arrCopy.splice(i,1); //Remove calItem from array
    const days = calItem.meetingPattern.split(' ')[0].split('');  //split meetingPattern days up
    //Iterate through each day looking for overlap
    days.forEach((day)=>{
      const callItemCopy = JSON.parse(JSON.stringify(calItem));
      callItemCopy.meetingPattern = day+' '+callItemCopy.meetingPattern.split(' ')[1];
      overlap.push( getOverlap([callItemCopy], arrCopy) )
    })
  })

  overlap = overlap.filter(item=>item.length > 1);  //Remove non-overlapping

  //Filters out duplicates
  let overlapUnique = [];
  overlap.forEach((item1,index1,arr)=>{
    if(-1===overlapUnique.findIndex(item2=>{
      return isSameOverlap(item1,item2);
    })) {
      overlapUnique.push(item1);
    }
  });
  overlap = overlapUnique;

  //Build meeting patterns for overlaping sets and reformat for later use
  overlap = overlap.map(item=>{
    //Get all times
    let times = [];
    let day = '';
    item.forEach(calItem=>{
      const [dayValue,timeSpan] = calItem.meetingPattern.split(' ');
      const [startTime,endTime] = timeSpan.split('-');
      times.push(startTime);
      times.push(endTime);
      day = dayValue;
    })
    const startTime = getEarliestTime(times);
    const endTime = getLatestTime(times);
    return {day, startTime, endTime, items: item}
  })
  
  //Returns the earliest time in an array
  function getEarliestTime(times) {
    let firstTime = times[0];
    times.forEach(time=> {
      firstTime = getTimeValue(firstTime)<getTimeValue(time)?firstTime:time;
    })
    return firstTime;
  }

  //Returns the latest time in an array
  function getLatestTime(times) {
    let lastTime = times[0];
    times.forEach(time=> {
      lastTime = getTimeValue(lastTime)<getTimeValue(time)?time:lastTime;
    })
    return lastTime;
  }



  //Compares calendar items for equality
  function isSameCalItem(item1, item2) {
    return JSON.stringify(item1) === JSON.stringify(item2);
  }

  //Compares overlapping set for sameness
  
  function isSameOverlap(item1, item2) {
    if(item1.length !== item2.length)
      return false;
    for(let comp1 of item1) {
      if(-1===item2.findIndex((comp2)=>{
        return isSameCalItem(comp1, comp2);
      })) {
        return false;
      }
    }
    return true;
  }

  //item: [{meetingPattern,...}, {meetingPattern,...}, ...]
  function getOverlap(item, arr) {
    let newItem = JSON.parse(JSON.stringify(item)); //Deep copy item
    const meetingPatternDay = item[0].meetingPattern.split(' ')[0]; //Get first item meeting pattern day and use that
    let arrCopy = JSON.parse(JSON.stringify(arr));

    newItem.forEach(item1=>{
      for(let index2=0;index2<arrCopy.length;index2++) {
        const item2 = arrCopy[index2];
        if( meetingPatternsOverlap(item1.meetingPattern, item2.meetingPattern) ) {
          item2.meetingPattern = meetingPatternDay+' '+item2.meetingPattern.split(' ')[1];  //change meeting pattern to have the day being evaluated
          //assign to item array
          newItem.push(item2);
          //trim collision item from arr
          arrCopy.splice(index2,1);
          break;
        }
      }
    })

    if(item.length === newItem.length) {
      return newItem;
    }

    return getOverlap(newItem, arrCopy);
  }

  //overlap/collisions output for display
  const collisionsOutput = overlap.map((event, index) => {
    if(compareSchedule) {
      return (
        <ContainerCollision
          style={{
            gridColumn: `${calDaysRight[event.day]}`,
            gridRow: `${calTimes[event.startTime]} / ${calTimes[event.endTime]}`,
          }}
          >
          {
            event.items.map(cl=>{
              return (
                <div 
                  className="subclass"
                  onClick={() => {
                    props.openClassModal(cl.classId);
                  }}
                  >
                  <p className="cal-front-item-course">
                    {cl.course}-{cl.section}
                  </p>
                  <p className="cal-front-item-p">
                    {cl.courseTitle.substring(0, 8) + '...'}
                  </p>
                </div>
              );
            })
          }
        </ContainerCollision>
      );
    } else {
      return (
        <ContainerCollision
        style={{
            gridColumn: `${calDays[event.day]}`,
            gridRow: `${calTimes[event.startTime]} / ${calTimes[event.endTime]}`,
          }}
          >
          {
            event.items.map(cl=>{
              return (
                <div 
                className="subclass"
                  onClick={() => {
                    props.openClassModal(cl.classId);
                  }}
                  >
                  <p className="cal-front-item-course">
                    {cl.course}-{cl.section}
                  </p>
                  <p className="cal-front-item-p">
                    {cl.courseTitle.substring(0, 15) + '...'}
                  </p>
                </div>
              );
            })
          }
        </ContainerCollision>
      );
    }

  });

  
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
    return <div className="calendar-front compare">{eventData.concat(eventDataOriginal).concat(collisionsOutput)}</div>;
  } else {
    return <div className="calendar-front">{eventData.concat(collisionsOutput)}</div>;
  }

}

export default CalendarFront;
