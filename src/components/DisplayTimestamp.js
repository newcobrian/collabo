import React from 'react';

const DisplayTimestamp = props => {
  const shortDays = ['Sun', 'Mon', 'Tues', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const removeTime = datetime => {
    var startMonth = datetime.getMonth(),
      startYear = datetime.getFullYear(),
      startDate = datetime.getDate(),
      timeless = new Date(startYear, startMonth, startDate);
    return timeless;
  }

  const displayDate = secs => {
    var datetime = new Date(secs);
    var dd = datetime.getDate();
    var mm = months[datetime.getMonth()];
    return mm + ' ' + dd;
  }

  const displayTime = secs => {
    if (!secs) return 'No start time';

    var d = new Date(secs);
    d = d.toLocaleTimeString().replace(/:\d+ /, ' ');
    return d;
  }

  const calcTimestamp = timestamp => {
    // if timestamp is from today, show the time
    let today = new Date(),
      todayStart = removeTime(today).getTime(),
      lastWeek = removeTime(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7)).getTime();

    if (removeTime(new Date(timestamp)).getTime() === todayStart) {
      return displayTime(timestamp);
    }
    // in the last week, show the day of the week + time
    else if (timestamp > lastWeek) {
      return shortDays[new Date(timestamp).getDay()] + ' ' + displayTime(timestamp);
    }
    // otherwise show the date + time
    else {
      return displayDate(timestamp) + ' ' + displayTime(timestamp);
    }
  }

  return (<span>{calcTimestamp(props.timestamp)}</span>);
}


export default DisplayTimestamp;