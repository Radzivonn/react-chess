import React, { FC } from 'react';
import { MoveList } from 'types/types';

interface Props {
  numberOfMoves: number;
  moves: MoveList;
  className?: string;
  selectedMove: number | null;
  selectMove: (moveIndex: number | null) => void;
}

const MoveTable: FC<Props> = ({ numberOfMoves, moves, className, selectedMove, selectMove }) => {
  const selectMoveOnClick = (moveIndex: number) => {
    selectMove(moveIndex >= numberOfMoves ? null : moveIndex);
  };

  return (
    <div className={`move-table ${className}`}>
      {moves.map((movePair, i) => (
        <div className="move-table__row" key={movePair[0] + movePair[1]}>
          <div className="move-table__column--row-number">{i + 1}</div>
          {movePair.map((move, j) => (
            <div
              key={String() + String(j)}
              className={`move-table__column ${2 * i + j + 1 === selectedMove ? 'active' : ''}`}
              onClick={() => selectMoveOnClick(2 * i + j + 1)}
            >
              {move}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default MoveTable;
