import { useGameStateStore } from 'store/useGameState';
import BoardModule from 'modules/ChessBoard/Board';

export const ChessBoard = () => {
  const board = useGameStateStore((state) => state.board);

  if (board) {
    return <BoardModule board={board} />;
  }

  return <></>;
};
