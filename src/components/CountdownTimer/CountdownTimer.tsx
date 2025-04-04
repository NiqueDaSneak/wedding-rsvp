import * as React from 'react';
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  date: string;
}

const CountdownTimer: React.FC<CountdownTimerProps> = ({ date }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const targetDate = new Date(date);

    const calculateTimeLeft = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        // The day has arrived!
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      // Calculate the time components
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    // Calculate immediately and then set interval
    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(timer);
  }, [date]);

  return (
    <span>
      {timeLeft.days} {timeLeft.days === 1 ? 'day' : 'days'}, {timeLeft.hours}{' '}
      {timeLeft.hours === 1 ? 'hour' : 'hours'}, {timeLeft.minutes}{' '}
      {timeLeft.minutes === 1 ? 'minute' : 'minutes'}, {timeLeft.seconds}{' '}
      {timeLeft.seconds === 1 ? 'second' : 'seconds'}
    </span>
  );
};

export default CountdownTimer;
