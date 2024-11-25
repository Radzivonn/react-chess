import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FigureNames } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-pawn.svg';
import whiteLogo from 'assets/white-pawn.svg';

type Direction = 1 | -1;
type FirstStepDirection = 2 | -2;

export class Pawn extends Figure {
  isFirstStep: boolean = true;

  constructor(x: number, y: number, color: Colors) {
    super(x, y, color);
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.name = FigureNames.PAWN;
  }

  canMove(board: Board, target: Cell, includingYourFigures: boolean): boolean {
    if (!super.canMove(board, target, includingYourFigures)) return false;

    const direction: Direction = this.color === Colors.BLACK ? 1 : -1; // TODO temporary decision
    const firstStepDirection: FirstStepDirection = this.color === Colors.BLACK ? 2 : -2;

    // if non-beating move
    if (target.x === this.x) {
      // if first step
      if (
        this.isFirstStep &&
        target.y === this.y + firstStepDirection &&
        target.isEmpty(board.currentPlayerColor) &&
        board.getCell(target.x, target.y - direction).isEmpty(board.currentPlayerColor)
      ) {
        return true;
      }

      if (
        target.y === this.y + direction &&
        board.getCell(target.x, target.y).isEmpty(board.currentPlayerColor)
      ) {
        return true;
      }
    }

    // if beating move
    if (this.isCellUnderAttack(target) && board.getCell(this.x, this.y).isEnemy(target)) {
      return true;
    }
    return false;
  }

  // The logic is placed in a separate function in order to use this function to calculate cells under attack
  isCellUnderAttack(target: Cell): boolean {
    const direction: Direction = this.color === Colors.BLACK ? 1 : -1; // TODO temporary decision

    if (target.y === this.y + direction && Math.abs(target.x - this.x) === 1) {
      return true;
    }
    return false;
  }

  // added moveFigure function for the pawn to track the first move
  moveFigure() {
    this.isFirstStep = false;
  }
}
