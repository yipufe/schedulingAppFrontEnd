import React from 'react';
import './classdetailslist.scss';

function ClassDetailsList(props) {
  return (
    <div className="">
      <table className="classDetailsList">
        <thead>
          <tr>
              {props.displayData.length>0 &&
                <th>
                  <h1>Class Details</h1>
                  <h2>{props.title}</h2>              
                </th>
              }
          </tr>
        </thead>
        <tbody>
          {props.displayData.map((item) => {
            return (
              <tr key={item.classId}
                onClick={() => {
                  props.openClassModal(item.classId);
                }}
              >
                <td className="classDetailsListItem">
                  <div className="classDetail">
                    <span className="bold">Title:</span> {item.courseTitle}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Course:</span> {item.course}-{item.section}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Instructor:</span> {item.instructor}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Meeting Time:</span>{' '}
                    {item.meetingPattern}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Location:</span> {item.location}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Block:</span> {item.block}
                  </div>
                  <div className="classDetail">
                    <span className="bold">Credit Hours:</span>{' '}
                    {item.creditHours}
                  </div>
                </td>
              </tr>
              //courseTitle, instructor, meetingPattern, location, block, creditHours, classId, course
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ClassDetailsList;
