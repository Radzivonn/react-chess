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

export type boardFENCharState = (FENChar | null)[][];

export interface HistorySnapshot {
  lastMove: LastMove | null;
  checkState: boolean;
  capturedWhiteFigures: FENChar[];
  capturedBlackFigures: FENChar[];
  board: boardFENCharState;
}

export type GameHistory = HistorySnapshot[];

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
