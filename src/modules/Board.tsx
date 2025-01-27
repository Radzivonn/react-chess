import React, { FC, useEffect, useState } from 'react';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import { Player } from 'models/Player';
import { FENChar, figureCosts } from 'types/enums';
import { PromotionFigureDialog } from 'components/PromotionFigureDialog';
import { Pawn } from 'models/figures/Pawn';
import LostFigures from 'modules/LostFigures';
import CellsModule from 'modules/CellsModule';
import DummyCellsModule from 'modules/DummyCellsModule';

interface BoardProps {
  board: Board;
  setBoard: (board: Board) => void;
  currentPlayer: Player | null;
  selectedMoveIndex: number;
  swapPlayer: () => void;
  setGameOverMessage: (gameOverMessage: string | null) => void;
}

const BoardModule: FC<BoardProps> = ({
  board,
  setBoard,
  currentPlayer,
  selectedMoveIndex,
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

  /**
   * Returns sum of figures weights.
   * White figures have positive weights, and black figures have negative weights.
   * If the sum is positive, then the material advantage is in the direction of White,
   * and if it is negative - in the direction of Black.
   */
  const evaluate = (): number => {
    const totalCost = board.gameHistory[selectedMoveIndex].board.reduce(
      (cost, row) => cost + row.reduce((acc, curr) => (curr ? acc + figureCosts[curr] : acc), 0),
      0,
    );
    return totalCost;
  };

  const evaluationSum = evaluate();

  return (
    <div className="board">
      <LostFigures
        evaluation={evaluationSum < 0 ? evaluationSum : null}
        figures={board.gameHistory[selectedMoveIndex].capturedWhiteFigures}
        className="area-top"
      />
      <ul className="symbols rows-numbers">
        {board.ROWS_NUMBERS.map((num) => (
          <li key={num}>{num}</li>
        ))}
      </ul>
      {selectedMoveIndex < board.gameHistory.length - 1 ? (
        <DummyCellsModule boardState={board.gameHistory[selectedMoveIndex].board} />
      ) : (
        <CellsModule board={board} selectedCell={selectedCell} moveFigure={moveFigure} />
      )}
      <ul className="symbols columns-letters">
        {board.COLUMNS_LETTERS.map((symbol) => (
          <li key={symbol}>{symbol}</li>
        ))}
      </ul>
      <LostFigures
        evaluation={evaluationSum > 0 ? evaluationSum : null}
        figures={board.gameHistory[selectedMoveIndex].capturedBlackFigures}
        className="area-bottom"
      />
      {isPromotionDialogActive && !promotedFigure && currentPlayer && (
        <PromotionFigureDialog
          color={currentPlayer?.color}
          setIsPromotionDialogActive={setIsPromotionDialogActive}
          selectPromotedFigure={setPromotedFigure}
        />
      )}
    </div>
  );
};

export default BoardModule;
