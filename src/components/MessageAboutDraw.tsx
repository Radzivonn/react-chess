import { FC } from 'react';

interface Props {
  isStalemate: boolean;
}

export const MessageAboutDraw: FC<Props> = ({ isStalemate }) => {
  return (
    <div className="message-bg">
      <div className="message"> {isStalemate ? 'Stalemate!' : 'Draw'} </div>
    </div>
  );
};
