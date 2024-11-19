import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-pawn.svg';
import whiteLogo from 'assets/white-pawn.svg';

export class Pawn extends Figure {
  isFirstStep: boolean = true;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }

  canMove(target: Cell): boolean {
    if (!super.canMove(target)) return false;
    const direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1;
    const firstStepDirection = this.cell.figure?.color === Colors.BLACK ? 2 : -2;

    // if non-beating move
    if (target.x === this.cell.x) {
      // if first step
      if (
        this.isFirstStep &&
        target.y === this.cell.y + firstStepDirection &&
        target.isEmpty() &&
        this.cell.board.getCell(target.x, target.y - direction).isEmpty()
      ) {
        return true;
      }

      if (
        target.y === this.cell.y + direction &&
        this.cell.board.getCell(target.x, target.y).isEmpty()
      ) {
        return true;
      }
    }

    // if beating move
    if (
      target.y === this.cell.y + direction &&
      Math.abs(target.x - this.cell.x) === 1 &&
      this.cell.isEnemy(target)
    ) {
      return true;
    }

    return false;
  }

  // added moveFigure function for the pawn to track the first move
  moveFigure() {
    this.isFirstStep = false;
  }
}
