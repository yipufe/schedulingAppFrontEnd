//Split time string into component parts
export function getTimeComponents(timeStr) {
    const meridian = timeStr.slice(-2);
    const [hour, minute] = timeStr.slice(0,timeStr.length-2).split(':');
    return {hour, minute, meridian};
}

//convert time string to 24 hour time and return object with values
export function get24Hour(timeStr) {
    let time = getTimeComponents(timeStr);
    time.hour = parseInt(time.hour);
    time.minute = time.minute === undefined?0:parseInt(time.minute);
    time.hour = time.hour === 12?0:time.hour;
    time.hour = time.meridian === 'pm'?time.hour+12:time.hour;
    return {hour: time.hour, minute: time.minute};
}

//Return a number representing the range in hours between two times
export function getTimeRange(timeStrStart, timeStrEnd) {
    const startTime = get24Hour(timeStrStart);
    const endTime = get24Hour(timeStrEnd);
    let [startValue,endValue] = [startTime.hour, endTime.hour];
    startValue+=startTime.minute/60;
    endValue+=endTime.minute/60;
    return Math.abs(startValue-endValue);
}

//turns time into double for comparison
export function getTimeValue(timeStr) {
    const time = get24Hour(timeStr);
    let timeValue = time.hour;
    timeValue += time.minute/60;
    return timeValue;
}

//Checks if meeting patterns overlap
export function meetingPatternsOverlap(t1, t2) {
    let [t1_days, t1_timeRange] = t1.split(' ');
    let [t2_days, t2_timeRange] = t2.split(' ');

    t1_days = t1_days.replace('a', '');
    t2_days = t2_days.replace('a', '');
    
    for(let i=0;i<t1_days.length;i++) {
      if(t2_days.includes(t1_days[i])) {  //If both meeting patterns have the same day
        return timeRangesOverlap(t1_timeRange, t2_timeRange);
      }
    }
    return false;
}

//Checks if time ranges overlap
export function timeRangesOverlap(t1, t2) {
    const [t1_start, t1_end] = t1.split('-');
    const [t2_start, t2_end] = t2.split('-');

    const t1_st_val = getTimeValue(t1_start);
    const t1_en_val = getTimeValue(t1_end);
    const t2_st_val = getTimeValue(t2_start);
    const t2_en_val = getTimeValue(t2_end);

    return (t1_st_val >= t2_st_val && t1_st_val <= t2_en_val) || 
            (t1_en_val >= t2_st_val && t1_en_val <= t2_en_val) ||
            (t2_st_val >= t1_st_val && t2_st_val <= t1_en_val) ||
            (t2_en_val >= t1_st_val && t2_en_val <= t1_en_val);
}