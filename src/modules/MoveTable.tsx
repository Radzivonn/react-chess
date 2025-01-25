import React, { FC } from 'react';
import { MoveList } from 'types/types';

interface Props {
  moves: MoveList;
  className?: string;
}

const MoveTable: FC<Props> = ({ moves, className }) => {
  return (
    <div className={`move-table ${className}`}>
      {moves.map((move, i) => (
        <div className="move-table__row" key={move[0] + move[1]}>
          <div className="move-table__column--row-number">{i + 1}</div>
          <div className="move-table__column">{move[0]}</div>
          <div className="move-table__column">{move[1]}</div>
        </div>
      ))}
    </div>
  );
};

export default MoveTable;
