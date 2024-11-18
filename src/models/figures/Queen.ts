import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-queen.svg';
import whiteLogo from 'assets/white-queen.svg';

export class Queen extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.QUEEN;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;

    const targetPos = [target.x, target.y] as const;
    if (this.cell.isEmptyVertical(...targetPos)) return true;
    if (this.cell.isEmptyHorizontal(...targetPos)) return true;
    if (this.cell.isEmptyDiagonal(...targetPos)) return true;

    return false;
  }
}
