import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-queen.svg';
import whiteLogo from 'assets/white-queen.svg';
import { Board } from 'models/Board';

export class Queen extends Figure {
  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.QUEEN;
  }

  canMove(board: Board, target: Cell, includingYourFigures: boolean): boolean {
    if (!super.canMove(board, target, includingYourFigures)) return false;

    const positions = [this.x, this.y, target.x, target.y] as const;
    if (board.isEmptyVertical(...positions)) return true;
    if (board.isEmptyHorizontal(...positions)) return true;
    if (board.isEmptyDiagonal(...positions)) return true;

    return false;
  }
}
