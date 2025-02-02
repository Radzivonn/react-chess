import { useEffect, useRef } from 'react';
import { Colors } from 'types/enums';
import { useGameStateStore } from 'store/gameSettingsStore';

type UseStockfishHook = (
  fen: string,
  moveFigure: (move: string) => void,
  skillLevel?: number,
  depth?: number,
) => void;

const useStockfish: UseStockfishHook = (fen, moveFigure, skillLevel = 10, depth = 13) => {
  const stockfishRef = useRef<Worker | null>(null);
  const { isGameStarted, currentPlayer, setEvaluation } = useGameStateStore();

  const parseEvaluation = (message: string) => {
    const matchCp = message.match(/score cp (-?\d+)/);
    const matchMate = message.match(/score mate (-?\d+)/);

    if (matchCp) {
      const pawnsCent = parseInt(matchCp[1]);
      const evalInPawns = pawnsCent / 100;
      return evalInPawns.toFixed(1);
    }

    if (matchMate) {
      return 'mate'; // !!! temporary
    }

    return '0.0';
  };

  const getEvalPercentage = (message: string) => {
    const score = parseEvaluation(message);

    if (score.includes('mate')) {
      return currentPlayer === Colors.WHITE ? '0%' : '100%';
    }

    const scaledEval = Math.atan(parseFloat(score) / 4) / (Math.PI / 2);
    return `${(50 - scaledEval * 50).toFixed(1)}%`;
  };

  const sendToStockfish = (command: string) => {
    if (stockfishRef.current) {
      stockfishRef.current.postMessage(command);
    }
  };

  useEffect(() => {
    stockfishRef.current = new Worker(new URL('/stockfish-16.1.js', import.meta.url), {
      type: 'module',
    });

    sendToStockfish('uci');
    sendToStockfish('isready');
    sendToStockfish('setoption name Move Overhead value 100');
    sendToStockfish(`setoption name Skill Level value ${skillLevel}`);

    return () => {
      if (stockfishRef.current) {
        sendToStockfish('stop');
        sendToStockfish('setoption name Clear Hash');
        stockfishRef.current.terminate();
      }
    };
  }, []);

  useEffect(() => {
    if (stockfishRef.current) {
      stockfishRef.current.onmessage = (event) => {
        const message = event.data;
        // console.log('Stockfish:', message);

        if (message.startsWith('info')) {
          const depthMatch = message.match(/depth (\d+)/);
          const currentDepth = depthMatch ? parseInt(depthMatch[1]) : null;
          if (currentDepth === depth) setEvaluation(getEvalPercentage(message));
        } else if (message.startsWith('bestmove')) {
          const bestMove = message.split(' ')[1];
          console.log('Best move:', bestMove);
          if (bestMove) moveFigure(bestMove);
        }
      };
    }
  }, [moveFigure]);

  useEffect(() => {
    if (!isGameStarted) {
      sendToStockfish('stop');
      sendToStockfish('setoption name Clear Hash');
      sendToStockfish('ucinewgame');
      sendToStockfish(`position fen ${fen}`);
      sendToStockfish('isready');
    }
  }, [isGameStarted]);

  // getting best move after every move
  useEffect(() => {
    if (currentPlayer === Colors.WHITE) {
      sendToStockfish('stop');
    } else if (stockfishRef.current) {
      sendToStockfish(`position fen ${fen}`);
      sendToStockfish('isready');
      sendToStockfish(`go depth ${depth}`);
    }
  }, [stockfishRef.current, currentPlayer]);
};

export default useStockfish;
