import { FC } from 'react';

interface Props {
  message: string;
}

export const FinishGameMessage: FC<Props> = ({ message }) => {
  return (
    <div className="message-bg">
      <div className="message"> {message} </div>
    </div>
  );
};
