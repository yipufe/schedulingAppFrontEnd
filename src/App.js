import React, { useState, useEffect, useRef } from 'react';
import './app.scss';
import Calendar from './Components/Calendar/Calendar';
import Sidebar from './Components/Sidebar/Sidebar';
import Header from './Components/Header/Header';
import Nav from './Components/Nav/Nav';
import Footer from './Components/Footer/Footer';
import { useReactToPrint } from 'react-to-print';
import Printable from './Components/Print/printable';
import ClassDetailsList from './Components/ClassDetailsList/classdetailslist';
import {meetingPatternsOverlap} from './time'

import Modal from 'react-modal';
import ClassModal from './Components/ClassModal/classmodal';
Modal.setAppElement('#root'); //Bind modal to app element

function App() {
  // All of these useState items are the states or data for different parts of the calendar.
  // This App component is the parent component to all of the other components.
  // We have all the data and functions here and then we pass them to the child components through props.
  const [initialData, setInitialData] = useState([]);
  const [initialAndChangedData, setInitialAndChangedData] = useState([]);
  const [initialDataFiltered, setInitialDataFiltered] = useState([]);
  const [displayData, setDisplayData] = useState([]);
  const [file, setFile] = useState('');
  const [course, setCourse] = useState([]);
  const [courseValue, setCourseValue] = useState([]);
  const [room, setRoom] = useState([]);
  const [roomValue, setRoomValue] = useState([]);
  const [instructor, setInstructor] = useState([]);
  const [instructorValue, setInstructorValue] = useState([]);
  const [block, setBlock] = useState([]);
  const [blockValue, setBlockValue] = useState([]);
  const [activeFilter, setActiveFilter] = useState({});
  const [activeFilterText, setActiveFilterText] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);
  const [collisions, setCollisions] = useState([]);
  const [classModalIsOpen, setClassModalIsOpen] = useState(false);
  const [classModalData, setClassModalData] = useState({});
  const [uniqueId, setUniqueId] = useState(0);
  const [yearSemester, setYearSemester] = useState('');
  const [showCalendar, setShowCalendar] = useState(true);

  //Sets meetingPattern in classModalData to new meeting pattern as defined in pattern
  function changeClassModalMeetingPattern(pattern) {
    const newClassModalData = { ...classModalData };
    
    //Modify meetingPatternText to reflect changes
    const oldPatterns = newClassModalData.meetingPatternText.split('; ');
    let newPat = '';
    let cnt = 0;
    for(let oldPat of oldPatterns) {
      if(oldPat !== undefined) {
        if(oldPat === newClassModalData.meetingPattern) {
          newPat += (cnt++===0?'':'; ') + pattern;
        } else {
          newPat += (cnt++===0?'':'; ') + oldPat;
        }  
      }
    }

    newClassModalData.meetingPattern = pattern;
    newClassModalData.meetingPatternText = newPat;

    setClassModalData(newClassModalData);
  }


  //Called when class information changes in the modal due to the user changing an input field
  //Uses the input id to identify what value is changing
  function changeClassModal(event) {
    const name = event.target.name;
    const value = event.target.value;

    const newClassModalData = { ...classModalData };
    newClassModalData[name] = value; //any other field look up and asign dirrectly
    setClassModalData(newClassModalData);
  }

  //Opens Modal with appropriate class information
  function openClassModal(classId) {
    const courseForModalDisplay = initialAndChangedData.find((item) => {
      return item.classId === classId;
    });

    setClassModalData(courseForModalDisplay);
    setClassModalIsOpen(true);
  }
  function closeClassModal() {
    setClassModalIsOpen(false);
  }

  //save class information entered into the class modal
  function saveClass(classId) {
    //If meeting pattern has no days default to Saturday
    if (classModalData.meetingPattern.split(' ')[0].length === 0) {
      classModalData.meetingPattern = 'Sa' + classModalData.meetingPattern;
    }

    const classIdPart = classId.split('_')[0];

    //set Changed data
    const indexChangedData = initialAndChangedData.findIndex((item) => {
      return item.classId === classId;
    });
    const tempChangedData = [...initialAndChangedData];
    tempChangedData[indexChangedData] = classModalData;



    //Change data
    const sameChangeClassSet = initialAndChangedData.filter(item=>{
      return item.classId.split('_')[0] === classIdPart;
    });
    
    sameChangeClassSet.forEach(itemWithId=>{
      const index = initialAndChangedData.findIndex(item=>{
        return item.classId === itemWithId.classId;
      })
      tempChangedData[index].meetingPatternText = classModalData.meetingPatternText;
    })
    setInitialAndChangedData(tempChangedData);




    setInitialAndChangedData(tempChangedData);

    //Set Display data
    const indexDisplayData = displayData.findIndex((item) => {
      return item.classId === classId;
    });
    const tempDisplayData = [...displayData];
    tempDisplayData[indexDisplayData] = classModalData;


    //Set display data
    const sameDisplayClassSet = displayData.filter(item=>{
      return item.classId.split('_')[0] === classIdPart;
    });

    sameDisplayClassSet.forEach(itemWithId=>{
      const index = displayData.findIndex(item=>{
        return item.classId === itemWithId.classId;
      })
      tempDisplayData[index].meetingPatternText = classModalData.meetingPatternText;
    })


    setDisplayData(tempDisplayData);

    //Hide modal
    setClassModalIsOpen(false);
  }

  //delete class modal control
  function deleteClass(classId) {
    //remove class from display data
    const indexDisplayData = displayData.findIndex((item) => {
      return item.classId === classId;
    });
    const tempDisplayData = [...displayData];
    tempDisplayData.splice(indexDisplayData, 1);
    setDisplayData(tempDisplayData);

    //remove class from initial data
    const indexInitialData = initialData.findIndex((item) => {
      return item.classId === classId;
    });
    const tempInitialData = [...initialData];
    tempInitialData.splice(indexInitialData, 1);
    setInitialData(tempInitialData);

    setClassModalIsOpen(false);
  }

  // This function is for when the user uploads a file it stores the file in the file state.
  const handleChange = (e) => {
    if(e.target.files.length > 0) {
      const file = e.target.files[0]; // accessing file
      setFile(file); // storing file
    }
  };

  //File reader with promise
  function promiseFileReader(file){
    return new Promise(res => {
      var fileReader = new FileReader();  
      fileReader.onload = res;
      fileReader.readAsText(file);
    });
  }

  /*
    This function is the main function that actually uploads the file to the server,
    then the function receives the response data (resData)
  */
  const csvFileHandler = (e) => {
    e.preventDefault();
    
    //Checks to see if a file was selected and is available for processing.
    if(file === '') {
      alert('No file selected!');
      return;
    }
    
    const formData = new FormData();
    
    const fileNameParts = file.name.split('.'); //Split file name at period
    let extension = '';
    if(fileNameParts.length > 1) {  //if file name contains no extention this will be false
      extension = fileNameParts[fileNameParts.length-1];
      if(extension==="sched") { //If file type is *.sched
        promiseFileReader(file).then(e=>{ //Parse file as text
          const sessionFromFile = JSON.parse(e.target.result);  //Convert to JSON obj

          if(sessionFromFile.initialData !== undefined &&   //Check for objects within
              sessionFromFile.initialDataFiltered !== undefined &&
              sessionFromFile.initialAndChangedData !== undefined &&
              sessionFromFile.displayData !== undefined &&
              sessionFromFile.courseValue !== undefined &&
              sessionFromFile.roomValue !== undefined &&
              sessionFromFile.instructorValue !== undefined &&
              sessionFromFile.blockValue !== undefined &&
              sessionFromFile.activeFilter !== undefined && 
              sessionFromFile.yearSemester !== undefined) {
            //populate values with contents
            setInitialData(sessionFromFile.initialData);
            setInitialDataFiltered(sessionFromFile.initialDataFiltered);
            setInitialAndChangedData(sessionFromFile.initialAndChangedData);
            setDisplayData(sessionFromFile.displayData);

            setCourseValue(sessionFromFile.courseValue);
            setRoomValue(sessionFromFile.roomValue);
            setInstructorValue(sessionFromFile.instructorValue);
            setBlockValue(sessionFromFile.blockValue);
            setActiveFilter(sessionFromFile.activeFilter);
            setActiveFilterText(sessionFromFile.activeFilter.filter+': '+sessionFromFile.activeFilter.options.label);

            setYearSemester(sessionFromFile.yearSemester);
          } else {
            alert("Couldn't read file!")
          }

        })    
      } else if(extension==="csv") {  //If file type is *.csv


        formData.append('csvfile', file);
        let url = 'https://schedge.dev/calendar/postcsv'; //'http://10.52.2.25:8080/calendar/postcsv';
        let method = 'POST';
    
        fetch(url, {
          method: method,
          body: formData,
        })
          .then((res) => {
            if (res.status !== 200) {
              throw new Error('Uploading file failed!');
            }
            return res.json();
          })
          .then((resData) => {

            setYearSemester( Object.keys(resData[0])[0] );  //Get the year and semester from the first line of the csv file (it shows up as the key in the JSON object)
            
            // These are all the empty arrays that will be filled with data after filtering through the resData.
            const dataArray = [];
            // This for loop is for filtering through the data and getting rid of all the heading rows and columns in the csv file.
            for (let item of resData) {
              if (item.field2 && item.field2 !== 'CLSS ID') {
                // This pushes the classes into the dataArray state.
                
                const meetingPatternString = item.field14;
                const meetingPatterns = meetingPatternString.split('; ');
                let peaceNumber = 1;
                for (let meetingPattern of meetingPatterns) {
                  if(meetingPattern !== undefined) {
                    dataArray.push({
                      block: item.field19,
                      campus: item.field21,
                      classId: item.field2+'_'+(peaceNumber++),   //adds a tag to the classId '_1', '_2', etc. so each split class has a unique classId
                      course: item.field9,
                      courseAttributes: item.field30,
                      courseTitle: item.field11,
                      creditHours: item.field27,
                      gradeMode: item.field28,
                      instructionMethod: item.field22,
                      instructor: item.field16.split(' (')[0],
                      location: item.field17,
                      maxEnrollment: item.field33,
                      maxWaitlistEnrollment: item.field36,
                      meetingPattern: meetingPattern,
                      meetingPatternText: meetingPatternString,
                      scheduleType: item.field12,
                      section: item.field10,
                      sectionAttributes: item.field29,
                      sectionComments: item.field44,
                      sectionText: item.field46,
                      session: item.field20,
                      specialApproval: item.field25,
                      status: item.field18,
                      visible: item.field24,
                    });

                  }
                }
              }
            }
            setInitialData(dataArray);
            setInitialDataFiltered(dataArray);
            setInitialAndChangedData(dataArray);
            setDisplayData(dataArray);
            setFirstLoad(true);
          })
          .catch((err) => console.log(err));
    

      } else {  //if file type is not supported
        console.log("File type unsupported!");
      }
    } else {  //if file type is not given
      console.log("File type unsupported!");
    }


  };

  //export to excel file and start download
  const exportAsExcelFileHandler = (ev) => {
    ev.preventDefault();
    const formData = new FormData();
    formData.append('displaydata', JSON.stringify(displayData));
    let url = 'https://schedge.dev/export/postexcel'; //'http://10.52.2.25:8080/export/postexcel';
    let method = 'POST';

    fetch(url, {
      method: method,
      body: formData,
    })
      .then((res) => {
        if (res.status !== 200) {
          throw new Error('Failed to create file!');
        }
        return res.blob();
      })
      .then((resData) => {
        console.log('RES:', resData);

        //Create link to click for automatic download
        const downloadLink = document.createElement('a');
        const url = window.URL.createObjectURL(resData);
        downloadLink.href = url;
        downloadLink.download = 'Excel.xlsx';
        downloadLink.click();
      });
  };

  //Saves session to file and auto downloads the file
  const saveSession = () => {
    const session = {
      initialData,
      initialDataFiltered,
      initialAndChangedData,
      displayData,

      courseValue,
      roomValue,
      instructorValue,
      blockValue,
      activeFilter,

      yearSemester,
    }

    //Create new file with session data as contents
    const file = new File([JSON.stringify(session)], 'Session.sched', {
      type: 'text/plain'
    });
    const downloadLink = document.createElement('a'); //create download link
    const url = window.URL.createObjectURL(file);
    downloadLink.href = url;  //set file as download content
    downloadLink.download = 'Session.sched';  //call the file Session.sched
    downloadLink.click(); //Start download

  }

  //Gets all collisions of calendar item
  const getCollisions = (compareItem, dataSet, filteredBy) => {
    if(compareItem.meetingPattern === 'Does Not Meet')
      return [];
    
    //get all collisions with compareItem
    let collisions = dataSet.filter((item)=>{
      let overlaps = false;
      if(compareItem[filteredBy] === item[filteredBy]) {
        if(item.meetingPattern !== 'Does Not Meet') {
          overlaps = meetingPatternsOverlap(compareItem.meetingPattern, item.meetingPattern)
        }
      }
      return overlaps;
    });
    if(collisions.length <= 1)
      return [];
    //Include under what condition the collision occurred
    collisions= collisions.map(collision=> {
      collision.collisionAt = filteredBy;
      return collision;
    });
    return JSON.parse( JSON.stringify( collisions ) );  //deep copy, passes back a copy of the collisions
  }

  useEffect(() => {
    const roomArray = [];
    const instructorArray = [];
    const blockArray = [];
    const courseArray = [];
    const collisionsArray = [];
    // This for loop loops through the dataArray and pushes the correct data into each of the different useState data arrays.
    for (let item of initialAndChangedData) {
      
      //Find collisions for courses
      const courseCollision = getCollisions(item, initialAndChangedData, 'course');
      if(courseCollision.length > 0)
        collisionsArray.push( courseCollision );
      
      //Find collisions for locations
      if(item.location !== "General Assignment Room" && item.location !== "LIVE STREAM" && item.location !== "General Assignment Room; ONLINE ONLINE") {
        const locationCollision = getCollisions(item, initialAndChangedData, 'location');
        if(locationCollision.length > 0)
          collisionsArray.push( locationCollision );
      }
      
      //Find collisions for instructors
      if(item.instructor !== "Staff [Primary, 100%]" ) {
        const instructorCollision = getCollisions(item, initialAndChangedData, 'instructor')
        if(instructorCollision.length > 0)
          collisionsArray.push( instructorCollision );
      }
      
      if (roomArray.length <= 0) {
        if(item.location===undefined) {
          item.location = item.building.concat(' ', item.room);
        }
        const room = item.location.split(';')[0]; //Remove extra information after the semicolon
        roomArray.push(room);
      }

      if (!roomArray.includes(item.location)) {
        if(item.location === undefined){
          item.location = item.building.concat(' ', item.room)
          const room = item.location.split(';')[0]; //Remove extra information after the semicolon
          roomArray.push(room);
        }
        const room = item.location.split(';')[0]; //Remove extra information after the semicolon
        roomArray.push(room);
      }
      if (instructorArray.length <= 0) {
        instructorArray.push(item.instructor);
      }
      if (!instructorArray.includes(item.instructor)) {
        instructorArray.push(item.instructor);
      }
      if (blockArray.length <= 0) {
        blockArray.push(item.block);
      }
      if (!blockArray.includes(item.block)) {
        blockArray.push(item.block);
      }
      if (courseArray.length <= 0) {
        courseArray.push({
          courseNumber: item.course,
          courseTitle: item.courseTitle,
        });
      }
      if (!courseArray.includes(item.courseTitle)) {
        courseArray.push({
          courseNumber: item.course,
          courseTitle: item.courseTitle,
        });
      }
    }

    //Remove duplicates from courseArray
    const courseArrayUnique = courseArray.filter((item, index, self) => {
      return (
        index ===
        self.findIndex((t) => {
          //This will return the first index match so will be false for duplicates
          return (
            t.courseNumber === item.courseNumber &&
            t.courseTitle === item.courseTitle
          ); //Finds index where this condition is true
        })
      );
    });
    //Remove duplicates from roomArray
    const roomArrayUnique = roomArray.filter((item, index, self) => {
      return (
        index ===
        self.findIndex((t) => {
          //This will return the first index match so will be false for duplicates
          return t === item; //Finds index where this condition is true
        })
      );
    });
    // These variables are for the filter dropdown options.
    // They filter through the specific arrays for each filter and add the correct data for the value and label in the object.
    const courseOptions = courseArrayUnique.sort().map((item) => {
      return {
        value: item.courseTitle,
        label: item.courseNumber + ' ' + item.courseTitle,
      };
    });
    const roomOptions = roomArrayUnique.sort().map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    const instructorOptions = instructorArray.sort().map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    const blockOptions = blockArray.sort().map((item) => {
      return {
        value: item,
        label: item,
      };
    });
    // These then set the useState variables with the correct data to be used elsewhere in the app.
    setCourse(courseOptions);
    setRoom(roomOptions);
    setInstructor(instructorOptions);
    setBlock(blockOptions);
    
    
    //Remove duplicates from collisionsArray
    const collisionsArrayTrimmed = collisionsArray.filter((collisionSet,index)=>{
      return index === collisionsArray.findIndex(item=>{
        return collisionSetsEquivalant(item, collisionSet);
      });
    });
    setCollisions(collisionsArrayTrimmed);
    

    if(firstLoad) {  //if file is loaded in clear filters which sets the course filter to a default course
      clearFilters();
      setFirstLoad( false );
    } else {
      //Redisplay data
      switch(activeFilter.filter) {
        case('Block'):
          handleBlockChange(activeFilter.options);
          break;
        case('Instructor'):
          handleInstructorChange(activeFilter.options);
          break;
        case('Room'):
          handleRoomChange(activeFilter.options);
          break;
        case('Course'):
          handleCourseChange(activeFilter.options);
          break;
        default:
      }
      
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAndChangedData, firstLoad]);

  //true if collision sets are identicle
  function collisionSetsEquivalant(set1,set2) {
    let matchCount=0;
    for(let i=0;i<set1.length;i++) {
      for(let j=0;j<set2.length;j++) {
        if(set1[i].classId === set2[j].classId && 
            set1[i].classId !== undefined && 
            set1[i].collisionAt === set2[j].collisionAt)
          matchCount++;
        else if(set1[i].course === set2[j].course &&
          set1[i].courseTitle === set2[j].courseTitle &&
          set1[i].instructor === set2[j].instructor && 
          set1[i].room === set2[j].room &&
          set1[i].meetingPattern === set2[j].meetingPattern &&
          set1[i].collisionAt === set2[j].collisionAt) {
            matchCount++;
          }
      }
    }
    return matchCount === set1.length;
  }

  // Each of these handle change functions do the same thing for each filter and are for when the user selects something in the filters.
  // When a user selects something it filters through the specific filter data and sets the specific useState with the new filtered data.
  // Each function also resets the other filters back to 0.  
  const handleBlockChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    const blockFilteredData = initialAndChangedData.filter(
      (item) => item.block === selectedOption.value
    );
    const blockFilteredInitialData = initialData.filter(
      (item) => item.block === selectedOption.value
    );
    setInitialDataFiltered(blockFilteredInitialData);
    setDisplayData(blockFilteredData);
    setBlockValue(selectedOption);
    setCourseValue({ label: 'Filter Course...', value: 0 });
    setInstructorValue({ label: 'Filter Instructor...', value: 0 });
    setRoomValue({ label: 'Filter Room...', value: 0 });
    setActiveFilter({options: selectedOption, filter: 'Block'});
    setActiveFilterText('Block: '+ selectedOption.label);
  };
  const handleInstructorChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    const instructorFilteredData = initialAndChangedData.filter(
      (item) => item.instructor === selectedOption.value
    );
    const instructorFilteredInitialData = initialData.filter(
      (item) => item.instructor === selectedOption.value
    );
    
    setInitialDataFiltered(instructorFilteredInitialData);
    setDisplayData(instructorFilteredData);
    setInstructorValue(selectedOption);
    setCourseValue({ label: 'Filter Course...', value: 0 });
    setBlockValue({ label: 'Filter Block...', value: 0 });
    setRoomValue({ label: 'Filter Room...', value: 0 });
    setActiveFilter({options: selectedOption, filter: 'Instructor'});
    setActiveFilterText('Instructor: '+ selectedOption.label);
  };
  const handleRoomChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    const roomFilteredData = initialAndChangedData.filter((item) => {
      /* SelectedOption.value will be only the room number such as "CS 406" and
        item.location will be the room number and may include details after such
        as "CS 406; Online Online"
        This will select all items that have the same room number in the front of the string*/
      return item.location.split(';')[0] === selectedOption.value;
    });
    const roomFilteredInitialData = initialData.filter((item) => {
      /* SelectedOption.value will be only the room number such as "CS 406" and
        item.location will be the room number and may include details after such
        as "CS 406; Online Online"
        This will select all items that have the same room number in the front of the string*/
      return item.location.split(';')[0] === selectedOption.value;
    });
    setInitialDataFiltered(roomFilteredInitialData);
    setDisplayData(roomFilteredData);
    setRoomValue(selectedOption);
    setCourseValue({ label: 'Filter Course...', value: 0 });
    setInstructorValue({ label: 'Filter Instructor...', value: 0 });
    setBlockValue({ label: 'Filter Block...', value: 0 });
    setActiveFilter({options: selectedOption, filter: 'Room'});
    setActiveFilterText('Room: '+ selectedOption.label);
  };
  const handleCourseChange = (selectedOption) => {
    console.log(`Option selected:`, selectedOption);
    const courseFilteredData = initialAndChangedData.filter(
      (item) => item.courseTitle === selectedOption.value
    );
    const courseFilteredInitailData = initialData.filter(
      (item) => item.courseTitle === selectedOption.value
    );
    setInitialDataFiltered(courseFilteredInitailData);
    setDisplayData(courseFilteredData);
    setCourseValue(selectedOption);
    setRoomValue({ label: 'Filter Room...', value: 0 });
    setInstructorValue({ label: 'Filter Instructor...', value: 0 });
    setBlockValue({ label: 'Filter Block...', value: 0 });
    setActiveFilter({options: selectedOption, filter: 'Course'});
    setActiveFilterText('Course: '+ selectedOption.label);
  };

  const clearFilters = () => {
    setDisplayData(initialAndChangedData);
    setInitialDataFiltered(initialData);
    setCourseValue({ label: 'Filter Course...', value: 0 });
    setRoomValue({ label: 'Filter Room...', value: 0 });
    setInstructorValue({ label: 'Filter Instructor...', value: 0 });
    setBlockValue({ label: 'Filter Block...', value: 0 });
    setActiveFilter({});

    //Filter default
    if(room.length > 0)
      handleRoomChange(room[0]);  //Set room filter to first room in room list
  };
  const handleResetCalendar = () => {
    setFile('');
    setBlock([]);
    setBlockValue([]);
    setCourse([]);
    setCourseValue([]);
    setInstructor([]);
    setInstructorValue([]);
    setRoom([]);
    setRoomValue([]);
    setInitialData([]);
    setDisplayData([]);
    setActiveFilter({});
    setInitialAndChangedData([]);
    setInitialDataFiltered([]);
    setYearSemester('');
  };

  //Print handler
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <div className="App">
      <Modal
        isOpen={classModalIsOpen}
        onRequestClose={closeClassModal}
        style={{ display: 'flex' }}
        className="add-class-modal"
        shouldCloseOnOverlayClick={false}
      >
        <ClassModal
          closeClassModal={closeClassModal}
          saveClass={saveClass}
          deleteClass={deleteClass}
          classModalData={classModalData}
          changed={changeClassModal}
          changeMeetingPattern={changeClassModalMeetingPattern}
        />
      </Modal>
      <Header />
      <Nav />
      <div className="app-body">
        <Sidebar
          // These are all of the props that are being sent to the Sidebar component
          fileHandler={csvFileHandler}
          handleChange={handleChange}
          course={course}
          courseValue={courseValue}
          courseAndNumber={course}
          room={room}
          roomValue={roomValue}
          instructor={instructor}
          instructorValue={instructorValue}
          block={block}
          blockValue={blockValue}
          handleBlockChange={handleBlockChange}
          handleInstructorChange={handleInstructorChange}
          handleRoomChange={handleRoomChange}
          handleCourseChange={handleCourseChange}
          clearFilters={clearFilters}
          setFile={setFile}
          setDisplayData={setDisplayData}
          setInitialData={setInitialData}
          handleResetCalendar={handleResetCalendar}
          collisions={collisions}
        />
        <Printable ref={componentRef}>
          {showCalendar && 
            <div className="printOnly">
              <div className="calTitleContainer">
                <div className="calTitle bold">{activeFilterText}</div>
              </div>
            </div>
          }
          <Calendar
            // These are all the props being sent to the Calendar component
            initialData={initialData}
            initialDataFiltered={initialDataFiltered}
            setInitialData={setInitialData}
            initialAndChangedData={initialAndChangedData}
            setInitialAndChangedData={setInitialAndChangedData}
            displayData={displayData}
            setDisplayData={setDisplayData}
            handlePrint={handlePrint}
            handleExcelExport={exportAsExcelFileHandler}
            openClassModal={openClassModal}
            activeFilter={activeFilter}
            saveSession={saveSession}
            setUniqueId={setUniqueId}
            uniqueId={uniqueId}
            handleBlockChange={handleBlockChange}
            handleInstructorChange={handleInstructorChange}
            handleRoomChange={handleRoomChange}
            handleCourseChange={handleCourseChange}
            clearFilters={clearFilters}
            yearSemester={yearSemester}
            setShowCalendar={setShowCalendar}
          />
          <ClassDetailsList 
            displayData={displayData} 
            title={activeFilterText}
            openClassModal={openClassModal}
          />
        </Printable>
      </div>
      <Footer />
    </div>
  );
}

export default App;
