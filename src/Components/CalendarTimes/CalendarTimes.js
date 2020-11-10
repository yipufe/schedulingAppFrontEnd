import React from 'react';
import './calendarTimes.scss';

// These are the times on the left of the calendar and are positioned with CSS Grid

function CalendarTimes() {
  return (
    <div className="full-cal-times">
      <div className="cal-time">7:00 am</div>
      <div className="cal-time">8:00 am</div>
      <div className="cal-time">9:00 am</div>
      <div className="cal-time">10:00 am</div>
      <div className="cal-time">11:00 am</div>
      <div className="cal-time">12:00 pm</div>
      <div className="cal-time">1:00 pm</div>
      <div className="cal-time">2:00 pm</div>
      <div className="cal-time">3:00 pm</div>
      <div className="cal-time">4:00 pm</div>
      <div className="cal-time">5:00 pm</div>
      <div className="cal-time">6:00 pm</div>
      <div className="cal-time">7:00 pm</div>
      <div className="cal-time">8:00 pm</div>
      <div className="cal-time">9:00 pm</div>
    </div>
  );
}

export default CalendarTimes;
