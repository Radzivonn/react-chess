import { useGameStateStore } from 'store/gameSettingsStore';

export const FinishGameMessage = () => {
  const gameOverMessage = useGameStateStore((state) => state.gameOverMessage);
  return (
    <div className="message-bg">
      <div className="message"> {gameOverMessage} </div>
    </div>
  );
};
