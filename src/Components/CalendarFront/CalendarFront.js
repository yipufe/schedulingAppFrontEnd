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
  let collisionSet;

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





  if(props.activeFilter !== undefined) {
    let [filterBy, filterValue] = props.activeFilter.split(': ');
    filterBy = filterBy.toLowerCase();
    
    let courseNumber, courseTitle;
    if(filterBy === 'course') {
      const filterValueArray = filterValue.split(' ');
      courseNumber = filterValueArray.slice(0,2).join(' ');
      courseTitle = filterValueArray.slice(2).join(' ');
    }

    //Filter collisions based on filter selection
    const collisions = props.collisions.filter(item=> {
      const indexMatch = item.findIndex(it=>{
        if(filterBy==='course') {
          return it.course === courseNumber && it.courseTitle === courseTitle;
        }
        if(filterBy==='room') {
          return it.location.split(';')[0] === filterValue;
        }
        return it[filterBy] === filterValue;
      })
      return indexMatch >= 0;
    });

    
    //calculate collisions time span
    collisionSet = collisions.map(collision=>{
      const meetingPatternsArray = [];
      collision.forEach(item=>{
        meetingPatternsArray.push( item.meetingPattern );
      });

      const meetingPatternPartsArray = meetingPatternsArray.map(meetingPattern=>{
        const [days, range] = meetingPattern.split(' ');
        const [startTime, endTime] = range.split('-');
        const parts = {
          days: days.split(''),
          startTime,
          endTime,
        }
        return parts;
      })

      //Find overlapping days
      let dayIntersections = [];
      if(meetingPatternPartsArray.length>0) {
        dayIntersections = meetingPatternPartsArray[0].days;
        meetingPatternPartsArray.forEach(meetingTime=>{
          dayIntersections = meetingTime.days.filter(day=>dayIntersections.includes(day));
        })
      }
      
      const startTimes = meetingPatternPartsArray.map(part=>{
        return part.startTime;
      });
      const endTimes = meetingPatternPartsArray.map(part=>{
        return part.endTime;
      });
      const startTime = getFirstTime(startTimes);
      const endTime = getLastTime(endTimes);      

      // console.log('Intersect pattern',dayIntersections, startTime+"-"+endTime);

      const meetingPattern = dayIntersections.join('')+' '+startTime+'-'+endTime;

      return {days:dayIntersections, startTime, endTime, meetingPattern ,collision};
    });


    function getCollisions() {
      const subCollisions = collisionSet
      .map((obj1, idx, arr) => {
        // Special case for last item; he's got no righthand neighbors, return empty result list
        if (idx === arr.length - 1) return []
    
        // everything else:
        return arr
          // get all elements to the right in the list
          .slice(idx + 1)
          // find all of them that have a collision with obj1
          .filter((obj2) => {
            const overlap = meetingPatternsOverlap(obj1.meetingPattern, obj2.meetingPattern);
            const contained = includes(obj1, obj2);       
            return overlap && !contained;
          })
          // return objects representing collision pairs
          .map((obj2) => ({ obj1, obj2 }))
      })
      // turn array of arrays of collision pairs into a single array
      .reduce((accumulator, arr) => accumulator.concat(arr), [])
  
      console.log(subCollisions);
      let newCollisions = [];
  
      //Combine collisions
      subCollisions.forEach(collision=>{
        let startTime, endTime;
        let newCollision = JSON.parse( JSON.stringify(collision.obj1) );
  
        //If start time from obj1 is less than start time from obj2 use obj1 start time otherwise use obj2 start time
        if( getTimeValue(collision.obj1.startTime)<getTimeValue(collision.obj2.startTime) ) {
          startTime = collision.obj1.startTime;
        } else {
          startTime = collision.obj2.startTime;
        }
        if( getTimeValue(collision.obj1.endTime)<getTimeValue(collision.obj2.endTime) ) {
          endTime = collision.obj2.endTime;
        } else {
          endTime = collision.obj1.endTime;
        }
        newCollision.startTime = startTime;
        newCollision.endTime = endTime;
  
        //TODO: Fix days
        newCollision.days = collision.obj1.days;
  
        const days = newCollision.meetingPattern.split(' ')[0];
        newCollision.meetingPattern = days+" "+startTime+"-"+endTime;
  
        //Add classes
        const collisionsToAdd = collision.obj2.collision.filter((col1,index1,arr)=>{
          if(-1 === newCollision.collision.findIndex((col2)=>{
            return classesEqual(col1, col2);
          }) ) {
            return true;
          } else {
            return false;
          }
        })
        collisionsToAdd.forEach(col=>{
          newCollision.collision.push(col);
        })
        
  
        newCollisions.push(newCollision);
  
      })
      return newCollisions
    }

    let lastCollisionSetLength = 0;
    let cnt = 0;
    while(lastCollisionSetLength<collisionSet.length && cnt++ < 2) {
      lastCollisionSetLength = collisionSet.length;

      const newSubCollisions = getCollisions();
      console.log(collisionSet.length ,newSubCollisions );
  
      if(newSubCollisions.length>0) {
        newSubCollisions.forEach(col=>{
          //If col is unique to the collisionSet array, add it to the array
          if(-1===collisionSet.findIndex(collision=>{
            return JSON.stringify(collision) === JSON.stringify(col)
          }))
            collisionSet.push(col);
        })
      }

    }


  }


  //Returns the earliest time in an array
  function getFirstTime(times) {
    let firstTime = times[0];
    times.forEach(time=> {
      firstTime = getTimeValue(firstTime)<getTimeValue(time)?firstTime:time;
    })
    return firstTime;
  }

  //Returns the latest time in an array
  function getLastTime(times) {
    let lastTime = times[0];
    times.forEach(time=> {
      lastTime = getTimeValue(lastTime)<getTimeValue(time)?time:lastTime;
    })
    return lastTime;
  }

  function includes(obj1, obj2) {
    return isSuperset(obj1.collision, obj2.collision) || isSuperset(obj2.collision, obj1.collision);
  }

  function isSuperset(set, subset) {
    for (let elem of subset) {
        if (-1===set.findIndex( (elem2)=>classesEqual(elem, elem2) )) {
            return false
        }
    }
    return true
  }

  function classesEqual(c1, c2) {
    if(c1.classId === c2.classId && 
      c1.classId !== undefined && 
      c2.classId !== undefined)
      return true;
    else if(c1.course === c2.course &&
      c1.courseTitle === c2.courseTitle &&
      c1.instructor === c2.instructor && 
      c1.room === c2.room &&
      c1.meetingPattern === c2.meetingPattern &&
      c1.collisionAt === c2.collisionAt) {
      return true;
    }
    return false;
  }

  const collisionsOutput = collisionSet.map((event, index) => {
    const colOutput = event.days.map(day=>{
      return (
        <ContainerCollision
          style={{
            gridColumn: `${calDays[day]}`,
            gridRow: `${calTimes[event.startTime]} / ${calTimes[event.endTime]}`,
          }}
        >
          {
            event.collision.map(cl=>{
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
    })

    return colOutput;
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
      const randValue = (Math.random()*100000)%10000;
      return (
        <Container
          key={`${day}-${event.classId}`}
          index={index}
          style={{
            gridColumn: `${calDaysLeft[day]}`,
            gridRow: `${calTimes[startTime]} / ${calTimes[endTime]}`,
          }}
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
      const randValue = (Math.random()*100000)%10000;
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
      }
      
    });

    return displayEvents;
  });

  if(compareSchedule) {
    return <div className="calendar-front compare">{eventData.concat(eventDataOriginal)}</div>;
  } else {
    return <div className="calendar-front">{eventData.concat(collisionsOutput)}</div>;
  }

}

export default CalendarFront;
