import React, { FC } from 'react';
import DummyCellComponent from './DummyCell';
import { boardFENCharState } from 'types/types';
import { Colors } from 'types/enums';

interface DummyCellsModuleProps {
  boardState: boardFENCharState;
}

// This is a component to display the state of the board on previous moves
const DummyCellsBlock: FC<DummyCellsModuleProps> = ({ boardState }) => {
  return (
    <div className="cells-block">
      {boardState.map((row, y) => (
        <React.Fragment key={y}>
          {row.map((figure, x) => (
            <DummyCellComponent
              key={String(figure) + String(x)}
              color={(x + y) % 2 === 0 ? Colors.WHITE : Colors.BLACK}
              figure={figure}
            />
          ))}
        </React.Fragment>
      ))}
    </div>
  );
};

export default DummyCellsBlock;
