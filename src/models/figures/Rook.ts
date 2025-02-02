import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';

export class Rook extends Figure {
  public hasMoved = false;

  constructor(x: number, y: number, color: Colors, hasMoved: boolean, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteRook : FENChar.BlackRook;
    this.hasMoved = hasMoved;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;
    const targetPos = [this.x, this.y, target.x, target.y] as const;
    if (board.isEmptyVertical(...targetPos) || board.isEmptyHorizontal(...targetPos)) {
      return true;
    }
    return false;
  }

  moveFigure() {
    this.hasMoved = true;
  }

  clone() {
    return new Rook(this.x, this.y, this.color, this.hasMoved, this.id);
  }
}
