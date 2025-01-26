import React, { FC } from 'react';
import { Colors, FENChar, figureImagePaths } from 'types/enums';

interface CellProps {
  color: Colors;
  figure: FENChar | null;
}

const DummyCellComponent: FC<CellProps> = ({ color, figure }) => {
  return (
    <div className={`cell ${color}`}>
      {figure && <img src={figureImagePaths[figure]} alt="figure" />}
    </div>
  );
};

export default DummyCellComponent;
