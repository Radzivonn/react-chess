import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import { Board } from 'models/Board';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';
import BoardModule from 'modules/Board';
import LostFigures from 'modules/LostFigures';
import Timer from 'modules/Timer';
import { WinnerMessage } from 'components/WinnerMessage';
import { StalemateMessage } from 'components/StalemateMessage';

const App = () => {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [isCheckMate, setIsCheckMate] = useState(false);
  const [isStalemate, setIsStalemate] = useState(false);

  useEffect(() => {
    restart();
  }, []);

  const restart = () => {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    setIsCheckMate(false);
    setIsStalemate(false);
  };

  const swapPlayer = () => {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
  };

  const getWinnerColor = () =>
    currentPlayer?.color === Colors.WHITE ? blackPlayer.color : whitePlayer.color;

  return (
    <div className="app">
      <Timer restart={restart} currentPlayer={currentPlayer} />
      <BoardModule
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        setIsCheckMate={setIsCheckMate}
        setIsStalemate={setIsStalemate}
      />
      <div>
        <LostFigures title="Black pieces" figures={board.lostBlackFigures} />
        <LostFigures title="White pieces" figures={board.lostWhiteFigures} />
      </div>
      {isCheckMate && <WinnerMessage winnerColor={getWinnerColor()} />}
      {isStalemate && <StalemateMessage />}
    </div>
  );
};

export default App;
