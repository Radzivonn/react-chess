import { Colors, FigureNames } from 'types/enums';
import { Figure } from './figures/Figure';

export class Cell {
  readonly id: number; // For react keys
  readonly color: Colors;
  readonly x: number;
  readonly y: number;
  figure: Figure | null;
  available: boolean; // Can you move onto a square
  isUnderAttack: boolean;

  constructor(x: number, y: number, color: Colors, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.available = false;
    this.isUnderAttack = false;
    this.id = Math.random();
  }

  isEmpty(playerColor: Colors): boolean {
    return (
      this.figure === null ||
      (this.figure.name === FigureNames.KING && this.figure.color === playerColor)
    );
  }

  isEnemy(target: Cell): boolean {
    if (target.figure && this.figure) {
      return this.figure.color !== target.figure.color;
    }
    return false;
  }
}
