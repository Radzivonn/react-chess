import React, { FC, useEffect, useState } from 'react';
import CellComponent from 'components/Cell';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import { Player } from 'models/Player';
import { Colors } from 'types/enums';
import { King } from 'models/figures/King';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
  setIsCheckMate: (isCheckMate: boolean) => void;
  setIsDraw: (isDraw: boolean) => void;
  setIsStalemate: (IsStalemate: boolean) => void;
}

const BoardModule: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  setIsCheckMate,
  setIsDraw,
  setIsStalemate,
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  const click = (cell: Cell) => {
    if (currentPlayer && selectedCell && selectedCell !== cell && cell.available) {
      board.moveFigure(selectedCell, cell);

      const nextPlayerColor = currentPlayer.color === Colors.BLACK ? Colors.WHITE : Colors.BLACK;
      const opponentFigures =
        nextPlayerColor === Colors.BLACK ? board.whiteFigures : board.blackFigures;

      const newBoard = board.getCopyBoard(nextPlayerColor, board.isInCheck(opponentFigures));

      if (newBoard.isCheckMate()) setIsCheckMate(true);
      if (newBoard.isDraw()) setIsDraw(true);
      if (newBoard.isStalemate()) setIsStalemate(true);

      newBoard.resetCellAvailabilityFlags();

      setBoard(newBoard);
      setSelectedCell(null);
      swapPlayer();
    } else if (cell.figure?.color === currentPlayer?.color) {
      setSelectedCell(cell);
      board.resetCellAvailabilityFlags();
    }
  };

  const highlightCells = () => {
    if (currentPlayer && selectedCell) {
      board.highlightCells(selectedCell);
      const newBoard = board.getCopyBoard(currentPlayer.color, board.checkState);
      setBoard(newBoard);
    }
  };

  return (
    <div>
      <h3>Current Player {currentPlayer?.color}</h3>
      <div className="board">
        <ul className="symbols rows-numbers">
          {board.ROWS_NUMBERS.map((num) => (
            <li key={num}>{num}</li>
          ))}
        </ul>
        <div className="cells-block">
          {board.cells.map((row, index) => (
            <React.Fragment key={index}>
              {row.map((cell) => (
                <CellComponent
                  click={click}
                  cell={cell}
                  key={cell.id}
                  selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                  checkState={
                    cell.figure?.color === board.currentPlayerColor &&
                    cell.figure instanceof King &&
                    board.checkState
                  }
                />
              ))}
            </React.Fragment>
          ))}
          <ul className="symbols columns-letters">
            {board.COLUMNS_LETTERS.map((symbol) => (
              <li key={symbol}>{symbol}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BoardModule;
