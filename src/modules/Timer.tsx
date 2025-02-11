import React, { FC, useEffect, useRef, useState } from 'react';
import { Colors } from 'types/enums';
import { useGameStateStore } from 'store/useGameState';
import convertTime from 'helpers/convertTime';

interface Props {
  timeControls: number;
}

const Timer: FC<Props> = ({ timeControls }) => {
  const [blackTime, setBlackTime] = useState(timeControls);
  const [whiteTime, setWhiteTime] = useState(timeControls);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);
  const { isGameStarted, board, currentPlayer, gameOverMessage, setGameOverMessage } =
    useGameStateStore();
  const isStopped = !!gameOverMessage || !isGameStarted;

  useEffect(() => {
    stopTimer();
  }, [isStopped]);

  useEffect(() => {
    if (isStopped) resetTimer();
    startTimer();
  }, [currentPlayer, isStopped]);

  useEffect(() => {
    if (whiteTime === 0) setGameOverMessage('Black won by time');
    else if (blackTime === 0) setGameOverMessage('White won by time');
  }, [whiteTime, blackTime]);

  const startTimer = () => {
    if (timer.current) clearInterval(timer.current);
    if (!isStopped) {
      const callback = currentPlayer === Colors.WHITE ? decrementWhiteTimer : decrementBlackTimer;
      timer.current = setInterval(callback, 1000);
    }
  };

  const stopTimer = () => {
    if (isStopped && timer.current) clearInterval(timer.current);
  };

  const decrementBlackTimer = () => {
    setBlackTime((prev) => prev - 1);
  };

  const decrementWhiteTimer = () => {
    setWhiteTime((prev) => prev - 1);
  };

  const resetTimer = () => {
    setWhiteTime(timeControls);
    setBlackTime(timeControls);
  };

  return (
    <div className="timer-block">
      <h2 className="timer">
        {board?.boardOrientation === Colors.WHITE ? convertTime(blackTime) : convertTime(whiteTime)}
      </h2>
      <h2 className="timer">
        {board?.boardOrientation === Colors.WHITE ? convertTime(whiteTime) : convertTime(blackTime)}
      </h2>
    </div>
  );
};

export default Timer;
