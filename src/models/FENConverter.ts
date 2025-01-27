import { Colors } from 'types/enums';
import { columns, LastMove } from 'types/types';
import { Figure } from './figures/Figure';
import { King } from './figures/King';
import { Rook } from './figures/Rook';
import { Pawn } from './figures/Pawn';
import { Cell } from './Cell';

export class FENConverter {
  public static readonly initialPosition: string =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  public convertBoardToFEN(
    board: Cell[][],
    playerColor: Colors,
    lastMove: LastMove | null,
    fiftyMoveRuleCounter: number,
    numberOfFullMoves: number,
  ): string {
    let FEN: string = '';

    for (let i = 0; i <= 7; i++) {
      let FENRow: string = '';
      let consecutiveEmptySquaresCounter = 0;

      for (const cell of board[i]) {
        if (!cell.figure) {
          consecutiveEmptySquaresCounter++;
          continue;
        }

        if (consecutiveEmptySquaresCounter !== 0) FENRow += String(consecutiveEmptySquaresCounter);

        consecutiveEmptySquaresCounter = 0;
        FENRow += cell.figure.FENChar;
      }

      if (consecutiveEmptySquaresCounter !== 0) FENRow += String(consecutiveEmptySquaresCounter);

      FEN += i === 7 ? FENRow : FENRow + '/';
    }

    const player: string = playerColor === Colors.WHITE ? 'w' : 'b';
    FEN += ' ' + player;
    FEN += ' ' + this.castlingAvailability(board);
    FEN += ' ' + this.enPassantPosibility(lastMove, playerColor);
    FEN += ' ' + fiftyMoveRuleCounter * 2;
    FEN += ' ' + numberOfFullMoves;
    return FEN;
  }

  private castlingAvailability(board: Cell[][]): string {
    const castlingPossibilities = (color: Colors): string => {
      let castlingAvailability: string = '';

      const kingPositionX: number = color === Colors.WHITE ? 0 : 7;
      const king: Figure | null = board[kingPositionX][4].figure;

      if (king instanceof King && !king.hasMoved) {
        const rookPositionX: number = kingPositionX;
        const kingSideRook = board[rookPositionX][7];
        const queenSideRook = board[rookPositionX][0];

        if (kingSideRook instanceof Rook && !kingSideRook.hasMoved) castlingAvailability += 'k';

        if (queenSideRook instanceof Rook && !queenSideRook.hasMoved) castlingAvailability += 'q';

        if (color === Colors.WHITE) castlingAvailability = castlingAvailability.toUpperCase();
      }
      return castlingAvailability;
    };

    const castlingAvailability: string =
      castlingPossibilities(Colors.WHITE) + castlingPossibilities(Colors.BLACK);
    return castlingAvailability !== '' ? castlingAvailability : '-';
  }

  private enPassantPosibility(lastMove: LastMove | null, color: Colors): string {
    if (!lastMove) return '-';
    const { figure, prevX, prevY } = lastMove;

    if (figure instanceof Pawn && Math.abs(figure.x - prevX) === 2) {
      const row: number = color === Colors.WHITE ? 6 : 3;
      return columns[prevY] + String(row);
    }
    return '-';
  }
}
