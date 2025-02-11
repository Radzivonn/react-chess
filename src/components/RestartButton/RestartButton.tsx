import { useEffect, useState } from 'react';
import { useGameSettingsStore } from 'store/useGameSettings';
import { useGameStateStore } from 'store/useGameState';
import { useMoveListStore } from 'store/useMoveList';
import { Board } from 'models/Board';
import { Colors } from 'types/enums';
import PlayerColorSelectionDialog from './PlayerColorSelectionDialog';

export const RestartButton = () => {
  const [isColorSelectionDialogActive, setIsColorSelectionDialogActive] = useState(false);
  const { settingsModified, setSettingsModified } = useGameSettingsStore();
  const { board, setIsGameStarted, setEvaluation, setBoard, setCurrentPlayer, setGameOverMessage } =
    useGameStateStore();
  const { setMoveList, setSelectedMoveIndex } = useMoveListStore();

  useEffect(() => {
    restart();
  }, []);

  useEffect(() => {
    if (settingsModified) {
      restart(board?.boardOrientation);
      setSettingsModified(false);
    }
  }, [settingsModified]);

  const restart = (boardOrientation?: Colors) => {
    const newBoard = new Board();
    newBoard.restartGame(boardOrientation);
    setIsGameStarted(false);
    setEvaluation('50%');
    setBoard(newBoard);
    setCurrentPlayer(Colors.WHITE);
    setGameOverMessage(null);
    setSelectedMoveIndex(0);
    setMoveList([]);
  };

  const onClickRestart = () => {
    setIsColorSelectionDialogActive(true);
  };

  const onSelect = (color: Colors) => {
    restart(color);
    setIsColorSelectionDialogActive(false);
  };

  return (
    <>
      <button className="button--icon relative z-[500]" onClickCapture={() => onClickRestart()}>
        <img width="54" height="54" color="red" src="/reload.svg" alt="restart" />
      </button>
      {isColorSelectionDialogActive && (
        <PlayerColorSelectionDialog
          setIsDialogActive={setIsColorSelectionDialogActive}
          selectColor={(color: Colors) => onSelect(color)}
        />
      )}
    </>
  );
};
