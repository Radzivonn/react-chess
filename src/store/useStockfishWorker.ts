import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface StockfishWorkerStore {
  stockfishWorker: Worker | null;
  setStockfishWorker: (stockfishWorker: Worker | null) => void;
  sendCommandToStockfish: (command: string) => void;
  startStockfish: () => void;
  restartStockfish: (fen: string) => void;
  stopStockfish: () => void;
  setupStockfish: (hash: number, maxMoveTime: number, skillLevel: number, UCIElo: number) => void;
  getBestStockfishMove: (fen: string, depth: number) => void;
}

export const useStockfishWorkerStore = create<StockfishWorkerStore>()(
  devtools((set, get) => ({
    stockfishWorker: null,
    setStockfishWorker: (worker) => set(() => ({ stockfishWorker: worker })),
    sendCommandToStockfish: (command: string) => {
      const { stockfishWorker } = get();
      if (stockfishWorker) {
        stockfishWorker.postMessage(command);
      } else {
        console.warn('Stockfish worker не установлен');
      }
    },
    startStockfish: () => {
      const { stockfishWorker, sendCommandToStockfish } = get();
      if (stockfishWorker) {
        sendCommandToStockfish('uci');
        sendCommandToStockfish('isready');
        sendCommandToStockfish('setoption name Threads value 4');
      }
    },
    restartStockfish: (fen) => {
      const { stockfishWorker, sendCommandToStockfish } = get();
      if (stockfishWorker) {
        sendCommandToStockfish('stop');
        sendCommandToStockfish('setoption name Clear Hash');
        sendCommandToStockfish('ucinewgame');
        sendCommandToStockfish(`position fen ${fen}`);
        sendCommandToStockfish('isready');
      }
    },
    stopStockfish: () => {
      const { stockfishWorker, sendCommandToStockfish } = get();
      if (stockfishWorker) {
        sendCommandToStockfish('stop');
        sendCommandToStockfish('setoption name Clear Hash');
        stockfishWorker.terminate();
      }
    },
    setupStockfish: (hash, maxMoveTime, skillLevel, UCIElo) => {
      const { stockfishWorker, sendCommandToStockfish } = get();
      if (stockfishWorker) {
        sendCommandToStockfish(`setoption name Hash value ${hash}`);
        sendCommandToStockfish(`setoption name Move Overhead value ${maxMoveTime}`);
        sendCommandToStockfish(`setoption name Skill Level value ${skillLevel}`);
        sendCommandToStockfish(`setoption name UCI_Elo type value ${UCIElo}`);
      }
    },
    getBestStockfishMove: (fen, depth) => {
      const { stockfishWorker, sendCommandToStockfish } = get();
      if (stockfishWorker) {
        sendCommandToStockfish(`position fen ${fen}`);
        sendCommandToStockfish('isready');
        sendCommandToStockfish(`go depth ${depth}`);
      }
    },
  })),
);

export default useStockfishWorkerStore;
