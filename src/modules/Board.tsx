import { useEffect, useState } from 'react';
import { Cell } from 'models/Cell';
import { Colors, FENChar } from 'types/enums';
import { PromotionFigureDialog } from 'components/PromotionFigureDialog';
import { Pawn } from 'models/figures/Pawn';
import LostFigures from 'modules/LostFigures';
import CellsModule from 'modules/CellsModule';
import DummyCellsModule from 'modules/DummyCellsModule';
import { useGameStateStore } from 'store/gameSettingsStore';
import { useMoveListStore } from 'store/moveListStore';
import evaluate from 'helpers/materialEvaluation';
import useStockfish from 'hooks/useStockfish';

const BoardModule = () => {
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
  const board = useGameStateStore((state) => state.board!); // board cannot be null because of CheckChessBoardAvailability hoc
  const { setMoveList, selectedMoveIndex, setSelectedMoveIndex } = useMoveListStore();

  const engineMoveFigure = (move: string) => {
    const currentCell = board.getCellByMoveNotation(move.slice(0, 2));
    const targetCell = board.getCellByMoveNotation(move.slice(2));
    const promotedFigure = move.slice(4) as FENChar; // !
    moveFigure(currentCell, targetCell, promotedFigure);
  };

  useStockfish(board.boardFENFormat, engineMoveFigure);

  useEffect(() => {
    highlightCells();
  }, [selectedCell]);

  useEffect(() => {
    if (promotedFigure && targetCell) clickOnFigure(targetCell);
  }, [promotedFigure]);

  const clickOnFigure = (cell: Cell) => {
    // !!! checking currentPlayer === Colors.WHITE TEMPORARY to test engine
    if (currentPlayer === Colors.WHITE && selectedCell && selectedCell !== cell && cell.available) {
      moveAction(selectedCell, cell);
    } else if (currentPlayer === Colors.WHITE && cell.figure?.color === currentPlayer) {
      setSelectedCell(cell);
      board.resetCellAvailabilityFlags();
    }
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

  const moveFigure = (currentCell: Cell, targetCell: Cell, promotedFigure?: FENChar) => {
    const newBoard = board.moveFigure(currentCell, targetCell, promotedFigure);
    setGameOverMessage(newBoard.gameOverMessage);
    setBoard(newBoard);
    setMoveList(newBoard.moveList);
    setSelectedCell(null);
    setIsPromotionDialogActive(false);
    setPromotedFigure(undefined);
    setTargetCell(null);
    setSelectedMoveIndex(board.gameHistory.length - 1);
    setCurrentPlayer(newBoard.currentPlayerColor);
    if (!isGameStarted) setIsGameStarted(true);
  };

  const highlightCells = () => {
    if (selectedCell) {
      board.highlightCells(selectedCell);
      setBoard(board);
    }
  };

  const evaluationSum = evaluate(board.gameHistory[selectedMoveIndex].board);

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
        <CellsModule board={board} selectedCell={selectedCell} moveFigure={clickOnFigure} />
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
