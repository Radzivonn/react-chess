import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-rook.svg';
import whiteLogo from 'assets/white-rook.svg';

export class Rook extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.ROOK;
  }

  canMove(target: Cell, includingYourFigures: boolean): boolean {
    if (!super.canMove(target, includingYourFigures)) return false;

    const targetPos = [target.x, target.y] as const;
    if (this.cell.isEmptyVertical(...targetPos) || this.cell.isEmptyHorizontal(...targetPos)) {
      return true;
    }

    return false;
  }
}
