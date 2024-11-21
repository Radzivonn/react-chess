import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import logo from 'assets/black-king.svg';

export class Figure {
  color: Colors;
  logo: typeof logo | null;
  cell: Cell;
  name: FigureNames;
  id: number;

  constructor(color: Colors, cell: Cell) {
    this.color = color;
    this.cell = cell;
    this.cell.figure = this;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
  }

  canMove(target: Cell, includingYourFigures: boolean): boolean {
    if (target.figure?.color === this.color && !includingYourFigures) return false; // if the attempt is to resemble a square where an allied piece stands
    if (target.figure?.name === FigureNames.KING) return false;
    return true;
  }

  // Method for check pawn attacks
  isCellUnderAttack(target: Cell): boolean {
    return false;
  }

  moveFigure() {}
}
