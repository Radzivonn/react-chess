import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Board } from 'models/Board';
import { Player } from 'models/Player';

interface GameStateStore {
  isGameStarted: boolean;
  setIsGameStarted: (isGameStarted: boolean) => void;
  board: Board | null;
  setBoard: (board: Board | null) => void;
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  gameOverMessage: string | null;
  setGameOverMessage: (message: string | null) => void;
}

export const useGameStateStore = create<GameStateStore>()(
  devtools((set) => ({
    isGameStarted: false,
    setIsGameStarted: (isGameStarted) => set(() => ({ isGameStarted })),
    board: null,
    setBoard: (board) => set(() => ({ board })),
    currentPlayer: null,
    setCurrentPlayer: (player) => set(() => ({ currentPlayer: player })),
    gameOverMessage: null,
    setGameOverMessage: (message) => set(() => ({ gameOverMessage: message })),
  })),
);
