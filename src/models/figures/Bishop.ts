import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import blackLogo from 'assets/black-bishop.svg';
import whiteLogo from 'assets/white-bishop.svg';
import { Cell } from 'models/Cell';

export class Bishop extends Figure {
  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.BISHOP;
  }

  canMove(board: Board, target: Cell, includingYourFigures = false): boolean {
    if (!super.canMove(board, target, includingYourFigures)) return false;
    if (board.isEmptyDiagonal(this.x, this.y, target.x, target.y)) return true;
    return false;
  }
}
