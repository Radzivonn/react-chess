import React, { useEffect, useState } from 'react';
import './styles/App.scss';
import { Board } from 'models/Board';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';
import BoardModule from 'modules/Board';
import LostFigures from 'modules/LostFigures';
import Timer from 'modules/Timer';
import { FinishGameMessage } from 'components/FinishGameMessage';

const App = () => {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);

  useEffect(() => {
    restart();
  }, []);

  const restart = () => {
    const newBoard = new Board();
    newBoard.initCells();
    newBoard.addFigures();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    setGameOverMessage(null);
  };

  const swapPlayer = () => {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
  };

  return (
    <div className="app">
      <Timer isStopped={!!gameOverMessage} restart={restart} currentPlayer={currentPlayer} />
      <BoardModule
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        swapPlayer={swapPlayer}
        setGameOverMessage={setGameOverMessage}
      />
      <div>
        <LostFigures title="Black pieces" figures={board.lostBlackFigures} />
        <LostFigures title="White pieces" figures={board.lostWhiteFigures} />
      </div>
      {!!gameOverMessage && <FinishGameMessage message={gameOverMessage} />}
    </div>
  );
};

export default App;
