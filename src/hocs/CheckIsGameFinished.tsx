import { type FC } from 'react';
import { ChildrenProps } from 'types/types';
import { useGameStateStore } from 'store/gameSettingsStore';

export const CheckIsGameFinished: FC<ChildrenProps> = ({ children }) => {
  const gameOverMessage = useGameStateStore((state) => state.gameOverMessage);
  if (gameOverMessage) {
    return children;
  }

  return <></>;
};
