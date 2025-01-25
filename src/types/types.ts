import { Figure } from 'models/figures/Figure';
import { FENChar, MoveType } from 'types/enums';

export type Coords = {
  x: number;
  y: number;
};

export type MoveList = [string, string?][];

export type LastMove = {
  figure: Figure;
  prevX: number;
  prevY: number;
  moveType: Set<MoveType>;
};

interface HistorySnapshot {
  lastMove: LastMove | null;
  checkState: boolean;
  board: (FENChar | null)[][];
}

export type GameHistory = HistorySnapshot[];

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
