import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-king.svg';
import whiteLogo from 'assets/white-king.svg';

export class King extends Figure {
  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    if (this.cell.y === target.y && Math.abs(this.cell.x - target.x) === 1) return true;
    if (this.cell.x === target.x && Math.abs(this.cell.y - target.y) === 1) return true;
    if (Math.abs(this.cell.x - target.x) === 1 && Math.abs(this.cell.y - target.y) === 1) {
      return true;
    }
    return false;
  }
}
