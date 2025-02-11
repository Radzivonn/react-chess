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
    originalBoard: Cell[][],
    playerColor: Colors,
    boardOrientation: Colors,
    lastMove: LastMove | null,
    fiftyMoveRuleCounter: number,
    numberOfFullMoves: number,
  ): string {
    let FEN = '';

    // if board orientation is black color, need to reverse rows and columns to get correct result
    const board =
      boardOrientation === Colors.WHITE
        ? originalBoard
        : originalBoard.toReversed().map((row) => row.toReversed());

    for (let i = 0; i <= 7; i++) {
      let FENRow = '';
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

    const player = playerColor === Colors.WHITE ? 'w' : 'b';
    FEN += ' ' + player;
    FEN += ' ' + this.castlingAvailability(board);
    FEN += ' ' + this.enPassantPosibility(lastMove, playerColor);
    FEN += ' ' + fiftyMoveRuleCounter * 2;
    FEN += ' ' + numberOfFullMoves;
    return FEN;
  }

  private castlingAvailability(board: Cell[][]): string {
    const castlingPossibilities = (color: Colors): string => {
      let castlingAvailability = '';

      const kingPositionY = color === Colors.WHITE ? 7 : 0; // !
      const king: Figure | null = board[kingPositionY][4].figure;

      if (king instanceof King && !king.hasMoved) {
        const rookPositionY = kingPositionY;
        const kingSideRook = board[rookPositionY][7].figure;
        const queenSideRook = board[rookPositionY][0].figure;

        if (kingSideRook instanceof Rook && !kingSideRook.hasMoved) castlingAvailability += 'k';

        if (queenSideRook instanceof Rook && !queenSideRook.hasMoved) castlingAvailability += 'q';

        if (color === Colors.WHITE) castlingAvailability = castlingAvailability.toUpperCase();
      }

      return castlingAvailability;
    };

    const castlingAvailability =
      castlingPossibilities(Colors.WHITE) + castlingPossibilities(Colors.BLACK);
    return castlingAvailability !== '' ? castlingAvailability : '-';
  }

  private enPassantPosibility(lastMove: LastMove | null, color: Colors): string {
    if (!lastMove) return '-';
    const { figure, prevX, prevY } = lastMove;

    if (figure instanceof Pawn && Math.abs(figure.y - prevY) === 2) {
      const row = color === Colors.WHITE ? 3 : 6; // !
      return columns[prevX] + String(row);
    }
    return '-';
  }
}
