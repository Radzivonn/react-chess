import { useEffect } from 'react';
import { useGameSettingsStore } from 'store/useGameSettings';
import { useGameStateStore } from 'store/useGameState';
import { useMoveListStore } from 'store/useMoveList';
import { Board } from 'models/Board';
import { Colors } from 'types/enums';

export const RestartButton = () => {
  const { settingsModified, setSettingsModified } = useGameSettingsStore();
  const { setIsGameStarted, setEvaluation, setBoard, setCurrentPlayer, setGameOverMessage } =
    useGameStateStore();
  const { setMoveList, setSelectedMoveIndex } = useMoveListStore();

  useEffect(() => {
    restart();
  }, []);

  useEffect(() => {
    if (settingsModified) {
      restart();
      setSettingsModified(false);
    }
  }, [settingsModified]);

  const restart = () => {
    const newBoard = new Board();
    newBoard.restartGame();
    setIsGameStarted(false);
    setEvaluation('50%');
    setBoard(newBoard);
    setCurrentPlayer(Colors.WHITE);
    setGameOverMessage(null);
    setSelectedMoveIndex(0);
    setMoveList([]);
  };

  return (
    <button className="button--icon relative z-[500]" onClick={() => restart()}>
      <img width="54" height="54" color="red" src="/public/reload.svg" alt="restart" />
    </button>
  );
};
