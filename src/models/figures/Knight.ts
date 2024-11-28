import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-knight.svg';
import whiteLogo from 'assets/white-knight.svg';

export class Knight extends Figure {
  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KNIGHT;
  }

  canMove(board: Board, target: Cell, includingYourFigures = false): boolean {
    if (!super.canMove(board, target, includingYourFigures)) return false;
    const dx = Math.abs(this.x - target.x);
    const dy = Math.abs(this.y - target.y);

    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }
}
