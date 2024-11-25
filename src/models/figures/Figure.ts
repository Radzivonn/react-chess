import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import logo from 'assets/black-king.svg';
import { Board } from 'models/Board';

export class Figure {
  readonly id: number;
  readonly color: Colors;
  x: number;
  y: number;
  logo: typeof logo | null;
  name: FigureNames;

  constructor(x: number, y: number, color: Colors) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.logo = null;
    this.name = FigureNames.FIGURE;
    this.id = Math.random();
  }

  canMove(board: Board, target: Cell, includingYourFigures = false): boolean {
    if (target.figure?.color === this.color && !includingYourFigures) return false; // if the attempt is to resemble a square where an allied piece stands

    // if (!this.isPositionSafeAfterMove(target)) return false;

    return true;
  }

  // Method for check pawn attacks
  isCellUnderAttack(target: Cell): boolean {
    return false;
  }

  moveFigure() {}
}
