import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board } from 'models/Board';
import { Colors } from 'types/enums';

interface GameStateStore {
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
  evaluation: string;
  setEvaluation: (evaluation: string) => void;
  board: Board | null;
  setBoard: (board: Board | null) => void;
  currentPlayer: Colors;
  setCurrentPlayer: (player: Colors) => void;
  gameOverMessage: string | null;
  setGameOverMessage: (message: string | null) => void;
}

export const useGameStateStore = create<GameStateStore>()(
  devtools((set) => ({
    isGameStarted: false,
    setIsGameStarted: (isGameStarted) => set(() => ({ isGameStarted })),
    evaluation: '50%',
    setEvaluation: (evaluation) => set(() => ({ evaluation })),
    board: null,
    setBoard: (board) => set(() => ({ board })),
    currentPlayer: Colors.WHITE,
    setCurrentPlayer: (player) => set(() => ({ currentPlayer: player })),
    gameOverMessage: null,
    setGameOverMessage: (message) => set(() => ({ gameOverMessage: message })),
  })),
);
