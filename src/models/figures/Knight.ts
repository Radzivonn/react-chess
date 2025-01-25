import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
export class Knight extends Figure {
  constructor(x: number, y: number, color: Colors, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhiteKnight : FENChar.BlackKnight;
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
