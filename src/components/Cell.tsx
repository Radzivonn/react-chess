import React, { FC } from 'react';
import { Cell } from 'models/Cell';
import { figureImagePaths } from 'types/enums';

interface CellProps {
  cell: Cell;
  selected: boolean;
  click: (cell: Cell) => void;
}

const CellComponent: FC<CellProps> = ({ cell, selected, click }) => {
  return (
    <div
      className={[
        'cell',
        cell.color,
        selected ? 'selected' : '',
        cell.available && cell.figure ? 'highlight-capture' : '',
      ].join(' ')}
      onClick={() => click(cell)}
    >
      {cell.available && !cell.figure && <div className={'available'} />}
      {cell.figure?.FENChar && <img src={figureImagePaths[cell.figure.FENChar]} alt="figure" />}
    </div>
  );
};

export default CellComponent;
