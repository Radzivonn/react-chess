import { FC } from 'react';
import { Colors } from 'types/enums';

interface Props {
  winnerColor: Colors;
}

export const WinnerMessage: FC<Props> = ({ winnerColor }) => {
  return (
    <div className="winner-message-bg">
      <div className="winner-message"> {winnerColor} won! </div>
    </div>
  );
};
