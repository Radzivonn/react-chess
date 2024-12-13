import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import blackLogo from 'assets/black-bishop.svg';
import whiteLogo from 'assets/white-bishop.svg';
import { Cell } from 'models/Cell';

export class Bishop extends Figure {
  constructor(x: number, y: number, color: Colors, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteBishop : FENChar.BlackBishop;
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;
    if (board.isEmptyDiagonal(this.x, this.y, target.x, target.y)) return true;
    return false;
  }

  clone() {
    return new Bishop(this.x, this.y, this.color, this.id);
  }
}
