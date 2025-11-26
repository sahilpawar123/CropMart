// src/components/common/CountdownTimer.jsx
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime }) => {
  const calculateTimeLeft = () => {
    const difference = +new Date(targetTime) - +new Date();
    let timeLeft = {};

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }
    return timeLeft;
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearTimeout(timer);
  });

  const timerComponents = Object.entries(timeLeft).map(([interval, value]) => {
    return (
      <span key={interval} className="text-red-600 font-mono text-lg">
        {String(value).padStart(2, '0')}{interval !== 'seconds' ? ':' : ''}
      </span>
    );
  });

  return (
    <div>
      {timerComponents.length ? timerComponents : <span>Auction Ended!</span>}
    </div>
  );
};

export default CountdownTimer;