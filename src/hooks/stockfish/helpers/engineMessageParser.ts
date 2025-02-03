import { Colors } from 'types/enums';

const parseEvaluation = (message: string) => {
  const matchCp = message.match(/score cp (-?\d+)/);
  const matchMate = message.match(/score mate (-?\d+)/);

  if (matchCp) {
    const pawnsCent = parseInt(matchCp[1]);
    const evalInPawns = pawnsCent / 100;
    return evalInPawns.toFixed(1);
  }

  if (matchMate) {
    return 'mate';
  }

  return '0.0';
};

export const getEvaluationPercentage = (message: string, currentPlayer: Colors) => {
  const score = parseEvaluation(message);

  if (score.includes('mate')) {
    return currentPlayer === Colors.WHITE ? '0%' : '100%';
  }

  const scaledEval = Math.atan(parseFloat(score) / 4) / (Math.PI / 2);
  return `${(50 - scaledEval * 50).toFixed(1)}%`;
};

export const getCurrentDepth = (message: string) => {
  const depthMatch = message.match(/depth (\d+)/);
  return depthMatch ? parseInt(depthMatch[1]) : null;
};

export const getBestMove = (message: string): string | null => message.split(' ')[1];
