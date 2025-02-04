import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board } from 'models/Board';
import { Colors } from 'types/enums';

interface GameStateStore {
  timeControls: number | null; // Time Controls of game in seconds, null - game without time controls
  isGameStarted: boolean;
  evaluation: string;
  board: Board | null;
  currentPlayer: Colors;
  gameOverMessage: string | null;
  setTimeControls: (timeControls: number | null) => void;
  setIsGameStarted: (isGameStarted: boolean) => void;
  setEvaluation: (evaluation: string) => void;
  setBoard: (board: Board | null) => void;
  setCurrentPlayer: (player: Colors) => void;
  setGameOverMessage: (message: string | null) => void;
}

export const useGameStateStore = create<GameStateStore>()(
  devtools((set) => ({
    isGameStarted: false,
    evaluation: '50%',
    board: null,
    currentPlayer: Colors.WHITE,
    gameOverMessage: null,
    setTimeControls: (timeControls) => set(() => ({ timeControls })),
    setIsGameStarted: (isGameStarted) => set(() => ({ isGameStarted })),
    setEvaluation: (evaluation) => set(() => ({ evaluation })),
    setBoard: (board) => set(() => ({ board })),
    setCurrentPlayer: (player) => set(() => ({ currentPlayer: player })),
    setGameOverMessage: (message) => set(() => ({ gameOverMessage: message })),
  })),
);
