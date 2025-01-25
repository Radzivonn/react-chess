import React, { FC } from 'react';
import { Figure } from 'models/figures/Figure';
import { figureImagePaths } from 'types/enums';

interface Props {
  figures: Figure[];
  className?: string;
}

const LostFigures: FC<Props> = ({ figures, className }) => {
  return (
    <div className={`lost-figures ${className}`}>
      {figures.map((figure) => (
        <div key={figure.id}>
          {figure.FENChar && <img width="32" height="32" src={figureImagePaths[figure.FENChar]} />}
        </div>
      ))}
    </div>
  );
};

export default LostFigures;
