import { type FC } from 'react';
import { ChildrenProps } from 'types/types';
import { useGameStateStore } from 'store/gameSettingsStore';

export const CheckChessBoardAvailability: FC<ChildrenProps> = ({ children }) => {
  const board = useGameStateStore((state) => state.board);
  if (board) {
    return children;
  }

  return <></>;
};
