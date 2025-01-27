import React, { FC } from 'react';
import { MoveList } from 'types/types';

interface Props {
  numberOfMoves: number;
  moves: MoveList;
  className?: string;
  selectedMove: number | null;
  selectMove: (moveIndex: number) => void;
}

const MoveTable: FC<Props> = ({ moves, className, selectedMove, selectMove }) => {
  return (
    <div className={`move-table ${className}`}>
      {moves.map((movePair, i) => (
        <div className="move-table__row" key={movePair[0] + movePair[1] + i}>
          <div className="move-table__column--row-number">{i + 1}</div>
          {movePair.map((move, j) => {
            const moveNumber = 2 * i + j + 1;
            return (
              <div
                key={moveNumber}
                className={`move-table__column ${moveNumber === selectedMove ? 'active' : ''}`}
                onClick={() => selectMove(moveNumber)}
              >
                {move}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MoveTable;
