import { FC, useEffect } from 'react';
import { useGameStateStore } from 'store/gameSettingsStore';
import { useMoveListStore } from 'store/moveListStore';
import { Board } from 'models/Board';
import { Colors } from 'types/enums';

interface Props {
  resetTimer: () => void;
}

export const RestartButton: FC<Props> = ({ resetTimer }) => {
  const { setIsGameStarted, setEvaluation, setBoard, setCurrentPlayer, setGameOverMessage } =
    useGameStateStore();
  const { setMoveList, setSelectedMoveIndex } = useMoveListStore();

  useEffect(() => {
    restart();
  }, []);

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

  const handleRestart = () => {
    resetTimer();
    restart();
  };

  return (
    <button className="button" onClick={() => handleRestart()}>
      Restart
    </button>
  );
};
