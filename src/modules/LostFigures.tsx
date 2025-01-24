import React, { FC } from 'react';
import { Figure } from 'models/figures/Figure';

interface Props {
  figures: Figure[];
  className?: string;
}

const LostFigures: FC<Props> = ({ figures, className }) => {
  return (
    <div className={`lost-figures ${className}`}>
      {figures.map((figure) => (
        <div key={figure.id}>{figure.logo && <img width="32" height="32" src={figure.logo} />}</div>
      ))}
    </div>
  );
};

export default LostFigures;
