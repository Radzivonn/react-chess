import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-rook.svg';
import whiteLogo from 'assets/white-rook.svg';

export class Rook extends Figure {
  public hasMoved = false;

  constructor(x: number, y: number, color: Colors, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteRook : FENChar.BlackRook;
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
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
    return new Rook(this.x, this.y, this.color, this.id);
  }
}
