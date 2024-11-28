import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-rook.svg';
import whiteLogo from 'assets/white-rook.svg';

export class Rook extends Figure {
  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.ROOK;
  }

  canMove(board: Board, target: Cell, includingYourFigures = false): boolean {
    if (!super.canMove(board, target, includingYourFigures)) return false;

    const targetPos = [this.x, this.y, target.x, target.y] as const;
    if (board.isEmptyVertical(...targetPos) || board.isEmptyHorizontal(...targetPos)) {
      return true;
    }

    return false;
  }
}
