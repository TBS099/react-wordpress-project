import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

function TimePassed(props) {
  const ISODate = Date.now();
  const date = new Date(ISODate);
  const isoString = date.toISOString();
  const duration = dayjs(isoString).to(props.TimePassed);

  return <div className="col-6 margin">{duration}</div>;
}
export default TimePassed;