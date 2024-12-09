import { FC } from 'react';
import { Colors } from 'types/enums';

interface Props {
  winnerColor: Colors;
}

export const WinnerMessage: FC<Props> = ({ winnerColor }) => {
  return (
    <div className="message-bg">
      <div className="message"> {winnerColor} won! </div>
    </div>
  );
};
