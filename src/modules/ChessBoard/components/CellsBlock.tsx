import React, { FC } from 'react';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import CellComponent from './Cell';

interface CellsModuleProps {
  board: Board;
  selectedCell: Cell | null;
  moveFigure: (cell: Cell) => void;
}

// This is a component to display the current state of the board and with interactivity
const CellsBlock: FC<CellsModuleProps> = ({ board, selectedCell, moveFigure }) => {
  return (
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
    </div>
  );
};

export default CellsBlock;
