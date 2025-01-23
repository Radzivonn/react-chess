import React, { FC, useEffect, useState } from 'react';
import CellComponent from 'components/Cell';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import { Player } from 'models/Player';
import { FENChar } from 'types/enums';
import { PromotionFigureDialog } from 'components/PromotionFigureDialog';
import { Pawn } from 'models/figures/Pawn';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  swapPlayer: () => void;
  setGameOverMessage: (gameOverMessage: string | null) => void;
}

const BoardModule: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  swapPlayer,
  setGameOverMessage,
}) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [isPromotionDialogActive, setIsPromotionDialogActive] = useState(false);
  const [promotedFigure, setPromotedFigure] = useState<FENChar>();
  const [targetCell, setTargetCell] = useState<Cell | null>(null); // only for promotion move

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  useEffect(() => {
    if (promotedFigure && targetCell) moveFigure(targetCell);
  }, [promotedFigure]);

  const moveFigure = (cell: Cell) => {
    if (currentPlayer && selectedCell && selectedCell !== cell && cell.available) {
      if (
        selectedCell.figure instanceof Pawn &&
        selectedCell.figure.isPromotionMove(cell.y) &&
        !isPromotionDialogActive
      ) {
        setTargetCell(cell);
        setIsPromotionDialogActive(true);
      } else {
        const newBoard = board.moveFigure(selectedCell, cell, promotedFigure);

        setGameOverMessage(newBoard.gameOverMessage);
        setBoard(newBoard);
        setSelectedCell(null);
        setIsPromotionDialogActive(false);
        setPromotedFigure(undefined);
        setTargetCell(null);
        swapPlayer();
      }
    } else if (cell.figure?.color === currentPlayer?.color) {
      setSelectedCell(cell);
      board.resetCellAvailabilityFlags();
    }
  };

  const highlightCells = () => {
    if (currentPlayer && selectedCell) {
      board.highlightCells(selectedCell);
      const newBoard = board.getCopyBoard(currentPlayer.color);
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
                  click={moveFigure}
                  cell={cell}
                  key={cell.id}
                  selected={cell.x === selectedCell?.x && cell.y === selectedCell?.y}
                />
              ))}
            </React.Fragment>
          ))}
          <ul className="symbols columns-letters">
            {board.COLUMNS_LETTERS.map((symbol) => (
              <li key={symbol}>{symbol}</li>
            ))}
          </ul>
          {isPromotionDialogActive && !promotedFigure && currentPlayer && (
            <PromotionFigureDialog
              color={currentPlayer?.color}
              setIsPromotionDialogActive={setIsPromotionDialogActive}
              selectPromotedFigure={setPromotedFigure}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default BoardModule;
