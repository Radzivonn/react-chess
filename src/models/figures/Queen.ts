import { Figure } from './Figure';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-queen.svg';
import whiteLogo from 'assets/white-queen.svg';
import { Board } from 'models/Board';

export class Queen extends Figure {
  constructor(x: number, y: number, color: Colors, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteQueen : FENChar.BlackQueen;
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;

    const positions = [this.x, this.y, target.x, target.y] as const;
    if (board.isEmptyVertical(...positions)) return true;
    if (board.isEmptyHorizontal(...positions)) return true;
    if (board.isEmptyDiagonal(...positions)) return true;

    return false;
  }

  clone() {
    return new Queen(this.x, this.y, this.color, this.id);
  }
}
