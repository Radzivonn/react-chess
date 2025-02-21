import { useGameStateStore } from 'store/useGameState';
import { FinishGameMessage } from 'components/FinishGameMessage';

export const CheckIsGameFinished = () => {
  const gameOverMessage = useGameStateStore((state) => state.gameOverMessage);

  if (gameOverMessage) {
    return <FinishGameMessage message={gameOverMessage} />;
  }

  return <></>;
};
