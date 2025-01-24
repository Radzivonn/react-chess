import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-king.svg';
import whiteLogo from 'assets/white-king.svg';
import { Rook } from './Rook';

export class King extends Figure {
  public hasMoved: boolean;

  constructor(x: number, y: number, color: Colors, hasMoved: boolean, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteKing : FENChar.BlackKing;
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.hasMoved = hasMoved;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;
    // horizontal
    if (this.y === target.y && Math.abs(this.x - target.x) === 1) return true;
    // vertical
    if (this.x === target.x && Math.abs(this.y - target.y) === 1) return true;
    // diagonal
    if (Math.abs(this.x - target.x) === 1 && Math.abs(this.y - target.y) === 1) {
      return true;
    }
    // king side castle
    if (this.y === target.y && this.x - target.x === -2 && this.canCastle(board, true)) return true;
    // queen side castle
    if (this.y === target.y && this.x - target.x === 2 && this.canCastle(board, false)) return true;
    return false;
  }

  private canCastle(board: Board, kingSideCastle: boolean) {
    if (this.hasMoved) return false;

    const rookX = kingSideCastle ? 7 : 0;
    const rook = board.getCell(rookX, this.y).figure;
    if (!(rook instanceof Rook) || rook.hasMoved || board.checkState) return false;

    const firstNextKingPosX = this.x + (kingSideCastle ? 1 : -1);
    const secondNextKingPosX = this.x + (kingSideCastle ? 2 : -2);

    if (
      board.getCell(firstNextKingPosX, this.y).figure ||
      board.getCell(secondNextKingPosX, this.y).figure
    ) {
      return false;
    }
    if (!kingSideCastle && board.getCell(1, this.y).figure) return false;

    /*
    check only first next cell because 
    when counting availability of the second next cell 
    isPositionSafeAfterMove function calls for only second cell 
    */
    return board.isPositionSafeAfterMove(
      board.getCell(this.x, this.y),
      board.getCell(firstNextKingPosX, this.y),
    );
  }

  moveFigure() {
    this.hasMoved = true;
  }

  clone() {
    return new King(this.x, this.y, this.color, this.hasMoved, this.id);
  }
}
