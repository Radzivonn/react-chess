import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
import { Board } from 'models/Board';

export class Figure {
  readonly id: number;
  readonly color: Colors;
  x: number;
  y: number;
  FENChar: FENChar | null = null;

  constructor(x: number, y: number, color: Colors, id = Math.random()) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.id = id;
  }

  canMove(board: Board, target: Cell): boolean {
    if (target.figure?.color === this.color) return false; // if the attempt is to resemble a square where an allied piece stands
    return true;
  }

  moveFigure() {}

  clone() {
    return new Figure(this.x, this.y, this.color); // it is only for correct types
  }
}
