import React, { FC } from 'react';
import CellsBlock from './CellsBlock';
import DummyCellsBlock from './DummyCellsBlock';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import { useMoveListStore } from 'store/useMoveList';

interface Props {
  board: Board;
  selectedCell: Cell | null;
  moveFigure: (cell: Cell) => void;
}

const Cells: FC<Props> = ({ board, selectedCell, moveFigure }) => {
  const selectedMoveIndex = useMoveListStore((state) => state.selectedMoveIndex);

  if (selectedMoveIndex < board.gameHistory.length - 1) {
    return <DummyCellsBlock boardState={board.gameHistory[selectedMoveIndex].board} />;
  }

  return <CellsBlock board={board} selectedCell={selectedCell} moveFigure={moveFigure} />;
};

export default Cells;
