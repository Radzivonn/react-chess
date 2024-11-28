import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-king.svg';
import whiteLogo from 'assets/white-king.svg';

export class King extends Figure {
  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KING;
  }

  canMove(board: Board, target: Cell, includingYourFigures = false): boolean {
    if (!super.canMove(board, target, includingYourFigures) || target.isUnderAttack) return false;
    // horizontal
    if (this.y === target.y && Math.abs(this.x - target.x) === 1) return true;
    // vertical
    if (this.x === target.x && Math.abs(this.y - target.y) === 1) return true;
    // diagonal
    if (Math.abs(this.x - target.x) === 1 && Math.abs(this.y - target.y) === 1) {
      return true;
    }
    return false;
  }
}
