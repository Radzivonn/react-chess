import { Figure } from './Figure';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-pawn.svg';
import whiteLogo from 'assets/white-pawn.svg';

type Direction = 1 | -1;
type FirstStepDirection = 2 | -2;

export class Pawn extends Figure {
  isFirstStep: boolean = true;

  constructor(color: Colors, cell: Cell) {
    super(color, cell);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }

  canMove(target: Cell, includingYourFigures: boolean): boolean {
    if (!super.canMove(target, includingYourFigures)) return false;

    const direction: Direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1; // TODO temporary decision
    const firstStepDirection: FirstStepDirection =
      this.cell.figure?.color === Colors.BLACK ? 2 : -2;

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
    if (this.isCellUnderAttack(target) && this.cell.isEnemy(target)) {
      return true;
    }
    return false;
  }

  // The logic is placed in a separate function in order to use this function to calculate cells under attack
  isCellUnderAttack(target: Cell): boolean {
    const direction: Direction = this.cell.figure?.color === Colors.BLACK ? 1 : -1; // TODO temporary decision

    if (target.y === this.cell.y + direction && Math.abs(target.x - this.cell.x) === 1) {
      return true;
    }
    return false;
  }

  // added moveFigure function for the pawn to track the first move
  moveFigure() {
    this.isFirstStep = false;
  }
}
