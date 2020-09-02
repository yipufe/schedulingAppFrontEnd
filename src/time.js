export function getTimeComponents(timeStr) {
    const meridian = timeStr.slice(-2);
    const [hour, minute] = timeStr.slice(0,timeStr.length-2).split(':');
    return {hour, minute, meridian};
}

export function get24Hour(timeStr) {
    let time = getTimeComponents(timeStr);
    time.hour = parseInt(time.hour);
    time.minute = time.minute === undefined?0:parseInt(time.minute);
    time.hour = time.hour === 12?0:time.hour;
    time.hour = time.meridian === 'pm'?time.hour+12:time.hour;
    return {hour: time.hour, minute: time.minute};
}

export function getTimeRange(timeStrStart, timeStrEnd) {
    const startTime = get24Hour(timeStrStart);
    const endTime = get24Hour(timeStrEnd);
    let [startValue,endValue] = [startTime.hour, endTime.hour];
    startValue+=startTime.minute/60;
    endValue+=endTime.minute/60;
    return Math.abs(startValue-endValue);
}