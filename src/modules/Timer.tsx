import React, { useEffect, useRef, useState } from 'react';
import { Colors } from 'types/enums';
import { useGameStateStore } from 'store/gameSettingsStore';
import convertTime from 'helpers/convertTime';
import { RestartButton } from 'components/RestartButton';

const GAME_TIME = 600; // TODO сделать выбор времени на партию (10 minutes) in seconds

const Timer = () => {
  const [blackTime, setBlackTime] = useState(GAME_TIME);
  const [whiteTime, setWhiteTime] = useState(GAME_TIME);
  const timer = useRef<null | ReturnType<typeof setInterval>>(null);
  const { isGameStarted, currentPlayer, gameOverMessage, setGameOverMessage } = useGameStateStore();
  const isStopped = !!gameOverMessage || !isGameStarted;

  useEffect(() => {
    stopTimer();
  }, [isStopped]);

  useEffect(() => {
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
    setWhiteTime(GAME_TIME);
    setBlackTime(GAME_TIME);
  };

  return (
    <div className="controls">
      <h2 className="timer">{convertTime(blackTime)}</h2>
      <div className="relative z-[500]">
        <RestartButton resetTimer={resetTimer} />
      </div>
      <h2 className="timer">{convertTime(whiteTime)}</h2>
    </div>
  );
};

export default Timer;
