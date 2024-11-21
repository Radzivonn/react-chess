import React, { FC, useEffect, useState } from 'react';
import CellComponent from 'components/Cell';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import { Player } from 'models/Player';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
}

const BoardModule: FC<BoardProps> = ({ board, setBoard, currentPlayer, swapPlayer }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  const click = (cell: Cell) => {
    if (selectedCell && selectedCell !== cell && selectedCell.figure?.canMove(cell, false)) {
      selectedCell.moveFigure(cell);
      swapPlayer();
      setSelectedCell(null);
      const newBoard = board.getCopyBoard();
      newBoard.resetIsCellUnderAttackFlags();
      setBoard(newBoard);
    } else {
      if (cell.figure?.color === currentPlayer?.color) {
        setSelectedCell(cell);
      }
    }
  };

  const highlightCells = () => {
    if (currentPlayer) {
      board.highlightCells(selectedCell, currentPlayer.color);
      const newBoard = board.getCopyBoard();
      setBoard(newBoard);
    }
  };

  return (
    <div>
      <h3>Current Player {currentPlayer?.color}</h3>
      <div className="board">
        {board.cells.map((row, index) => (
          <React.Fragment key={index}>
            {row.map((cell) => (
              <CellComponent
                click={click}
                cell={cell}
                key={cell.id}
                selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
              />
            ))}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default BoardModule;
