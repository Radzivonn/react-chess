import { useEffect } from 'react';
import { Colors, FENChar } from 'types/enums';
import { useGameStateStore } from 'store/useGameState';
import {
  getBestMove,
  getCurrentDepth,
  getEvaluationPercentage,
} from './helpers/engineMessageParser';
import isEnumValue from 'helpers/CheckIsEnumValue';
import { Board } from 'models/Board';
import { Cell } from 'models/Cell';
import useStockfishSettingsStore from 'store/useStockfishSettings';
import useStockfishWorkerStore from 'store/useStockfishWorker';

type UseStockfishHook = (
  board: Board,
  moveFigure: (currentCell: Cell, targetCell: Cell, promotedFigure?: FENChar) => void,
) => void;

const useStockfish: UseStockfishHook = (board, moveFigure) => {
  const {
    stockfishWorker,
    setStockfishWorker,
    sendCommandToStockfish,
    startStockfish,
    restartStockfish,
    stopStockfish,
    setupStockfish,
    getBestStockfishMove,
  } = useStockfishWorkerStore();
  const settingsModified = useStockfishSettingsStore((state) => state.stockfishSettingsModified);
  const setSettingsModified = useStockfishSettingsStore(
    (state) => state.setStockfishSettingsModified,
  );
  const getItem = useStockfishSettingsStore((state) => state.getItem);
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

  const setupEngine = () => {
    setupStockfish(
      getItem('hash').value,
      getItem('moveOverheadValue').value,
      getItem('engineSkillLevel').value,
      getItem('UCIEloValue').value,
    );
  };

  useEffect(() => {
    setStockfishWorker(
      new Worker(new URL('/stockfish-16.1.js', import.meta.url), {
        type: 'module',
      }),
    );
    startStockfish();
    setupEngine();

    return () => {
      stopStockfish();
    };
  }, []);

  useEffect(() => {
    if (settingsModified) {
      setupEngine();
      setSettingsModified(false);
    }
  }, [settingsModified]);

  useEffect(() => {
    if (stockfishWorker) {
      stockfishWorker.onmessage = (event) => {
        const message = event.data;
        // console.log('Stockfish:', message);
        if (message.startsWith('info') && getCurrentDepth(message) === getItem('depth').value) {
          setEvaluation(getEvaluationPercentage(message, currentPlayer));
        } else if (message.startsWith('bestmove')) {
          const bestMove = getBestMove(message);
          console.log('Best move:', bestMove);
          if (bestMove) engineMoveFigure(bestMove);
        }
      };
    }
  }, [moveFigure]);

  useEffect(() => {
    if (!isGameStarted) {
      restartStockfish(board.boardFENFormat);
    }
  }, [isGameStarted]);

  // getting best move after every move
  useEffect(() => {
    if (currentPlayer === Colors.WHITE) {
      sendCommandToStockfish('stop');
    } else if (stockfishWorker) {
      getBestStockfishMove(board.boardFENFormat, getItem('depth').value);
    }
  }, [stockfishWorker, board.boardFENFormat]);
};

export default useStockfish;
