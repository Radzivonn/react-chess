import React, { FC } from 'react';
import { FENChar, figureCosts, figureImagePaths } from 'types/enums';

interface Props {
  evaluation: number | null;
  figures: FENChar[];
  className?: string;
}

const CapturedFigures: FC<Props> = ({ evaluation, figures, className }) => {
  return (
    <div className={`captured-figures ${className}`}>
      {evaluation && <h3> +{Math.abs(evaluation)} </h3>}
      {figures
        .toSorted((a, b) => Math.abs(figureCosts[b]) - Math.abs(figureCosts[a]))
        .map((figure, i) => (
          <div key={figure + i}>
            <img width="32" height="32" src={figureImagePaths[figure]} />
          </div>
        ))}
    </div>
  );
};

export default CapturedFigures;
