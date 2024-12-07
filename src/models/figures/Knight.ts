import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-knight.svg';
import whiteLogo from 'assets/white-knight.svg';

export class Knight extends Figure {
  constructor(x: number, y: number, color: Colors, id?: number) {
    super(x, y, color, id);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.KNIGHT;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;
    const dx = Math.abs(this.x - target.x);
    const dy = Math.abs(this.y - target.y);

    return (dx === 1 && dy === 2) || (dx === 2 && dy === 1);
  }

  clone() {
    return new Knight(this.x, this.y, this.color, this.id);
  }
}
