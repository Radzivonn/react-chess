import { useEffect, useRef } from 'react';
import { Colors, FENChar } from 'types/enums';
import { useGameStateStore } from 'store/gameSettingsStore';
import {
  getBestMove,
  getCurrentDepth,
  getEvaluationPercentage,
} from './helpers/engineMessageParser';
import isEnumValue from 'helpers/CheckIsEnumValue';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';

type UseStockfishHook = (
  board: Board,
  moveFigure: (currentCell: Cell, targetCell: Cell, promotedFigure?: FENChar) => void,
  skillLevel?: number,
  depth?: number,
) => void;

const useStockfish: UseStockfishHook = (
  board,
  moveFigure,
  hash = 128,
  maxMoveTime = 500,
  skillLevel = 10,
  UCIElo = 1500,
  depth = 15,
) => {
  const stockfishRef = useRef<Worker | null>(null);
  const { isGameStarted, currentPlayer, setEvaluation } = useGameStateStore();

  const engineMoveFigure = (move: string) => {
    const currentCell = board.getCellByMoveNotation(move.slice(0, 2));
    const targetCell = board.getCellByMoveNotation(move.slice(2));
    const promotedFigureChar = move.slice(4);
    const promotedFigure = isEnumValue(FENChar, promotedFigureChar)
      ? promotedFigureChar
      : undefined;
    moveFigure(currentCell, targetCell, promotedFigure);
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
    sendToStockfish('setoption name Threads value 4');
    sendToStockfish(`setoption name Hash value ${hash}`);
    sendToStockfish(`setoption name Move Overhead value ${maxMoveTime}`);
    sendToStockfish(`setoption name Skill Level value ${skillLevel}`);
    sendToStockfish(`setoption name UCI_Elo type value ${UCIElo}`);

    console.log('RERENDER');

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
        if (message.startsWith('info') && getCurrentDepth(message) === depth) {
          setEvaluation(getEvaluationPercentage(message, currentPlayer));
        } else if (message.startsWith('bestmove')) {
          const bestMove = getBestMove(message);
          console.log('Best move:', bestMove); // ! remove
          if (bestMove) engineMoveFigure(bestMove);
        }
      };
    }
    console.log('rerender useEffect');
  }, [moveFigure]);

  useEffect(() => {
    if (!isGameStarted) {
      sendToStockfish('stop');
      sendToStockfish('setoption name Clear Hash');
      sendToStockfish('ucinewgame');
      sendToStockfish(`position fen ${board.boardFENFormat}`);
      sendToStockfish('isready');
    }
  }, [isGameStarted]);

  // getting best move after every move
  useEffect(() => {
    // !
    if (currentPlayer === Colors.WHITE) {
      sendToStockfish('stop');
    } else if (stockfishRef.current) {
      sendToStockfish(`position fen ${board.boardFENFormat}`);
      sendToStockfish('isready');
      sendToStockfish(`go depth ${depth}`);
    }
    console.log('rerender move effect');
  }, [stockfishRef.current, board.boardFENFormat]);
};

export default useStockfish;
