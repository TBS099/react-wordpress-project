import React from "react";
import './Time.css';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

//Creates TimePassed Function
function TimePassed(props) {
  const ISODate = Date.now();
  const date = new Date(ISODate);
  const isoString = date.toISOString();
  const duration = dayjs(isoString).to(props.TimePassed);

  //Displays HTML
  return <div className="col-6 margin">{duration}</div>;
}
export default TimePassed;