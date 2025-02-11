import { FC, useEffect, useState } from 'react';
import { Cell } from 'models/Cell';
import { FENChar } from 'types/enums';
import { PromotionFigureDialog } from './components/PromotionFigureDialog';
import { Pawn } from 'models/figures/Pawn';
import CapturedFigures from './components/CapturedFigures';
import Cells from './components/Cells';
import BoardLineSymbols from './components/BoardLineSymbols';
import { useGameStateStore } from 'store/useGameState';
import { useMoveListStore } from 'store/useMoveList';
import evaluate from 'helpers/materialEvaluation';
import useStockfish from 'hooks/stockfish/useStockfish';
import { Board } from 'models/Board';

interface Props {
  board: Board;
}

const BoardModule: FC<Props> = ({ board }) => {
  const [selectedCell, setSelectedCell] = useState<Cell | null>(null);
  const [isPromotionDialogActive, setIsPromotionDialogActive] = useState(false);
  const [promotedFigure, setPromotedFigure] = useState<FENChar>();
  const [targetCell, setTargetCell] = useState<Cell | null>(null); // only for promotion move
  const {
    isGameStarted,
    currentPlayer,
    setIsGameStarted,
    setBoard,
    setCurrentPlayer,
    setGameOverMessage,
  } = useGameStateStore();
  const { setMoveList, selectedMoveIndex, setSelectedMoveIndex } = useMoveListStore();

  const moveFigure = (currentCell: Cell, targetCell: Cell, promotedFigure?: FENChar) => {
    const newBoard = board.moveFigure(currentCell, targetCell, promotedFigure);
    setGameOverMessage(newBoard.gameOverMessage);
    setBoard(newBoard);
    setMoveList(newBoard.moveList);
    setSelectedCell(null);
    setIsPromotionDialogActive(false);
    setPromotedFigure(undefined);
    setTargetCell(null);
    setSelectedMoveIndex(newBoard.gameHistory.length - 1);
    setCurrentPlayer(newBoard.currentPlayerColor);
    if (!isGameStarted) setIsGameStarted(true);
  };

  const moveAction = (selectedCell: Cell, cell: Cell) => {
    // if move is promotion open promotion move dialog
    if (
      selectedCell.figure instanceof Pawn &&
      selectedCell.figure.isPromotionMove(cell.y) &&
      !isPromotionDialogActive
    ) {
      setTargetCell(cell);
      setIsPromotionDialogActive(true);
    } else {
      moveFigure(selectedCell, cell, promotedFigure);
    }
  };

  const clickOnFigure = (cell: Cell) => {
    if (currentPlayer === board.boardOrientation) {
      if (selectedCell && selectedCell !== cell && cell.available) {
        moveAction(selectedCell, cell);
      } else if (cell.figure?.color === currentPlayer) {
        setSelectedCell(cell);
        board.resetCellAvailabilityFlags();
      }
    }
  };

  const highlightCells = () => {
    if (selectedCell) {
      board.highlightCells(selectedCell);
      setBoard(board);
    }
  };

  useStockfish(board, moveFigure);

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  useEffect(() => {
    if (promotedFigure && targetCell) clickOnFigure(targetCell);
  }, [promotedFigure]);

  const evaluationSum = evaluate(board.gameHistory[selectedMoveIndex].board);

  return (
    <div className="board">
      <CapturedFigures
        evaluation={evaluationSum < 0 ? evaluationSum : null}
        figures={board.gameHistory[selectedMoveIndex].capturedWhiteFigures}
        className="area-top"
      />
      <BoardLineSymbols symbols={board.ROWS_NUMBERS} className="rows-numbers" />
      <Cells board={board} selectedCell={selectedCell} moveFigure={clickOnFigure} />
      <BoardLineSymbols symbols={board.COLUMNS_LETTERS} className="columns-letters" />
      <CapturedFigures
        evaluation={evaluationSum > 0 ? evaluationSum : null}
        figures={board.gameHistory[selectedMoveIndex].capturedBlackFigures}
        className="area-bottom"
      />
      {isPromotionDialogActive && !promotedFigure && (
        <PromotionFigureDialog
          color={currentPlayer}
          setIsPromotionDialogActive={setIsPromotionDialogActive}
          selectPromotedFigure={setPromotedFigure}
        />
      )}
    </div>
  );
};

export default BoardModule;
