import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import blackLogo from 'assets/black-bishop.svg';
import whiteLogo from 'assets/white-bishop.svg';
import { Cell } from 'models/Cell';

export class Bishop extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.BISHOP;
  }

  canMove(target: Cell, includingYourFigures: boolean): boolean {
    if (!super.canMove(target, includingYourFigures)) return false;
    if (this.cell.isEmptyDiagonal(target.x, target.y)) return true;
    return false;
  }
}
