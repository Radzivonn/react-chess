import React, { FC, useEffect, useRef, useState } from 'react';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';

interface TimerProps {
  isStopped: boolean;
  currentPlayer: Player | null;
  restart: () => void;
}

const GAME_TIME = 600; // (10 minutes) in seconds

const Timer: FC<TimerProps> = ({ isStopped, currentPlayer, restart }) => {
  const [blackTime, setBlackTime] = useState(GAME_TIME);
  const [whiteTime, setWhiteTime] = useState(GAME_TIME);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    stopTimer();
  }, [isStopped]);

  useEffect(() => {
    startTimer();
  }, [currentPlayer, isStopped]);

  const startTimer = () => {
    console.log('started');

    if (timer.current) clearInterval(timer.current);
    if (!isStopped) {
      const callback =
        currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
      timer.current = setInterval(callback, 1000);
    }
  };

  const stopTimer = () => {
    console.log('stopped');
    if (isStopped && timer.current) clearInterval(timer.current);
  };

  const decrementBlackTimer = () => {
    setBlackTime((prev) => prev - 1);
  };

  const decrementWhiteTimer = () => {
    setWhiteTime((prev) => prev - 1);
  };

  const handleRestart = () => {
    setWhiteTime(GAME_TIME);
    setBlackTime(GAME_TIME);
    restart();
  };

  return (
    <div>
      <div className="relative z-[500]">
        <button onClick={handleRestart}>Restart game</button>
      </div>
      <h2>Black - {blackTime}</h2>
      <h2>White - {whiteTime}</h2>
    </div>
  );
};

export default Timer;
