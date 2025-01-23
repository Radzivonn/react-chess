import { Figure } from 'models/figures/Figure';
import { FENChar, MoveType } from 'types/enums';

export type MoveList = [string, string?][];

export type LastMove = {
  figure: Figure;
  prevX: number;
  prevY: number;
  moveType: Set<MoveType>;
};

export type GameHistory = {
  lastMove: LastMove | undefined;
  checkState: boolean;
  board: (FENChar | null)[][];
}[];

export const columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
