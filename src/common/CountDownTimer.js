import React, { useMemo } from 'react';
import Countdown from 'react-countdown';

const CountDownTimer = ({ startTimestamp, endTimestamp, showLabel = true }) => {
  // Custom logic to calculate if current time is within 3 min before start and before end

  const startTime = new Date(startTimestamp);
  const threeMinBeforeStart = new Date(startTime.getTime() - 3 * 60 * 1000);

  const isLive = useMemo(() => {
    if (!startTimestamp || !endTimestamp) return false;
    const now = new Date();
    const endTime = new Date(endTimestamp);
    return now >= threeMinBeforeStart && now <= endTime;
  }, [startTimestamp, endTimestamp]);

  const renderer = ({ days, hours, minutes, seconds, completed }) => {
    if (isLive || completed) {
      return (
        <>
          {/* <span className="text-red-500 font-semibold">
            {showLabel ? 'Live' : ''}
          </span> */}
        </>
      );
    } else {
      return (
        <span className="md:text-[14px] text-[12px] rounded-[26px] px-4 py-2 border border-white md:absolute static top-[40px] right-[40px] md:flex mb-3">
          {/* {showLabel && 'time left to bet : '} */}
          {days > 0 && `${days}d `}{hours}h {minutes}m {seconds}s
        </span>
      );
    }
  };

  return (
    <Countdown
      date={new Date(threeMinBeforeStart)}
      renderer={renderer}
    />
  );
};

export default CountDownTimer;
