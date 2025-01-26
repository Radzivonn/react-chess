import React, { useEffect, useState } from 'react';
import { Board } from 'models/Board';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';
import BoardModule from 'modules/Board';
import Timer from 'modules/Timer';
import { FinishGameMessage } from 'components/FinishGameMessage';
import MoveTable from 'modules/MoveTable';

const Game = () => {
  const [board, setBoard] = useState(new Board());
  const [whitePlayer] = useState(new Player(Colors.WHITE));
  const [blackPlayer] = useState(new Player(Colors.BLACK));
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number | null>(null);

  useEffect(() => {
    restart();
  }, []);

  const restart = () => {
    const newBoard = new Board();
    newBoard.restartGame();
    setBoard(newBoard);
    setCurrentPlayer(whitePlayer);
    setGameOverMessage(null);
  };

  const swapPlayer = () => {
    setCurrentPlayer(currentPlayer?.color === Colors.WHITE ? blackPlayer : whitePlayer);
  };

  return (
    <div className="game">
      <Timer isStopped={!!gameOverMessage} restart={restart} currentPlayer={currentPlayer} />
      <BoardModule
        board={board}
        setBoard={setBoard}
        currentPlayer={currentPlayer}
        selectedMoveIndex={selectedMoveIndex}
        swapPlayer={swapPlayer}
        setGameOverMessage={setGameOverMessage}
      />
      <MoveTable
        numberOfMoves={board.gameHistory.length - 1}
        moves={board.moveList}
        selectedMove={selectedMoveIndex}
        selectMove={setSelectedMoveIndex}
      />
      {!!gameOverMessage && <FinishGameMessage message={gameOverMessage} />}
    </div>
  );
};

export default Game;
