import React, { FC } from 'react';
import { Cell } from 'models/Cell';

interface CellProps {
  cell: Cell;
  selected: boolean;
  checkState: boolean; // only for king's cell
  click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({ cell, selected, checkState, click }) => {
  return (
    <div
      className={[
        'cell',
        cell.color,
        selected ? 'selected' : '',
        checkState ? 'in-check' : '',
      ].join(' ')}
      onClick={() => click(cell)}
      style={{
        background: cell.available && cell.figure ? 'var(--cell-with-figure-available-color)' : '',
      }}
    >
      {cell.available && !cell.figure && <div className={'available'} />}
      {cell.figure?.logo && <img src={cell.figure.logo} alt="" />}
    </div>
  );
};

export default CellComponent;
