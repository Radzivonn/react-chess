import { Colors } from 'types/enums';
import { LastMove } from 'types/types';
import { Figure } from './figures/Figure';
import { King } from './figures/King';
import { Rook } from './figures/Rook';
import { Pawn } from './figures/Pawn';
import { Cell } from './Cell';
import { Board } from 'models/Board';

export class FENConverter {
  public static readonly initialPosition: string =
    'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  public convertBoardToFEN(originalBoard: Board, fiftyMoveRuleCounter: number): string {
    let FEN = '';

    // if board orientation is black color, need to reverse rows and columns to get correct result
    const board =
      originalBoard.boardOrientation === Colors.WHITE
        ? originalBoard.cells
        : originalBoard.cells.toReversed().map((row) => row.toReversed());

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

    const player = originalBoard.currentPlayerColor === Colors.WHITE ? 'w' : 'b';
    FEN += ' ' + player;
    FEN += ' ' + this.castlingAvailability(originalBoard.cells, originalBoard.boardOrientation);
    FEN +=
      ' ' +
      this.enPassantPossibility(
        originalBoard.lastMove,
        originalBoard.currentPlayerColor,
        originalBoard.boardOrientation,
        originalBoard.COLUMNS_LETTERS,
        originalBoard.ROWS_NUMBERS,
      );
    FEN += ' ' + fiftyMoveRuleCounter * 2;
    FEN += ' ' + originalBoard.fullNumberOfMoves;
    return FEN;
  }

  private castlingAvailability(board: Cell[][], boardOrientation: Colors): string {
    const castlingPossibilities = (color: Colors, boardOrientation: Colors): string => {
      let castlingAvailability = '';

      const kingPositionY = color === boardOrientation ? 7 : 0;
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
      castlingPossibilities(Colors.WHITE, boardOrientation) +
      castlingPossibilities(Colors.BLACK, boardOrientation);
    return castlingAvailability !== '' ? castlingAvailability : '-';
  }

  private enPassantPossibility(
    lastMove: LastMove | null,
    color: Colors,
    boardOrientation: Colors,
    columns: string[],
    rows: string[],
  ): string {
    console.log('last ', lastMove);

    if (!lastMove) return '-';
    const { figure, prevX, prevY } = lastMove;

    if (figure instanceof Pawn && Math.abs(figure.y - prevY) === 2) {
      const row = color === boardOrientation ? 3 : 6;
      return columns[prevX] + String(rows[row - 1]);
    }
    return '-';
  }
}
