import React, { useEffect, useState } from 'react';
import { Board } from 'models/Board';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';
import BoardModule from 'modules/Board';
import Timer from 'modules/Timer';
import { FinishGameMessage } from 'components/FinishGameMessage';
import MoveTable from 'modules/MoveTable';

const Game = () => {
  const [board, setBoard] = useState<Board | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameOverMessage, setGameOverMessage] = useState<string | null>(null);
  const [selectedMoveIndex, setSelectedMoveIndex] = useState<number>(0);

  useEffect(() => {
    restart();
  }, []);

  const restart = () => {
    const newBoard = new Board();
    newBoard.restartGame();
    setBoard(newBoard);
    setCurrentPlayer(new Player(Colors.WHITE));
    setGameOverMessage(null);
    setSelectedMoveIndex(0);
  };

  const swapPlayer = () => {
    if (board) {
      setCurrentPlayer(
        currentPlayer?.color === Colors.WHITE ? new Player(Colors.BLACK) : new Player(Colors.WHITE),
      );
      setSelectedMoveIndex(board.gameHistory.length - 1);
    }
  };

  return (
    board && (
      <div className="game">
        <Timer
          isStopped={!!gameOverMessage}
          currentPlayer={currentPlayer}
          restart={restart}
          setGameOverMessage={setGameOverMessage}
        />
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
    )
  );
};

export default Game;
