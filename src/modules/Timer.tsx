import React, { FC, useEffect, useRef, useState } from 'react';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';

interface TimerProps {
  currentPlayer: Player | null;
  restart: () => void;
}

const GAME_TIME = 600; // (10 minutes) in seconds

const Timer: FC<TimerProps> = ({ currentPlayer, restart }) => {
  const [blackTime, setBlackTime] = useState(GAME_TIME);
  const [whiteTime, setWhiteTime] = useState(GAME_TIME);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    startTimer();
  }, [currentPlayer]);

  const startTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    const callback =
      currentPlayer?.color === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
    timer.current = setInterval(callback, 1000);
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
