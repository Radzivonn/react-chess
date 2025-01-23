import { Figure } from './Figure';
import { Board } from 'models/Board';
import { Colors, FENChar } from 'types/enums';
import { Cell } from '../Cell';
import blackLogo from 'assets/black-pawn.svg';
import whiteLogo from 'assets/white-pawn.svg';
import { LastMove } from 'types/types';

type Direction = 1 | -1;
type FirstStepDirection = 2 | -2;

export class Pawn extends Figure {
  public isFirstStep: boolean;

  constructor(x: number, y: number, color: Colors, isFirstStep: boolean, id?: number) {
    super(x, y, color, id);
    this.FENChar = color === Colors.WHITE ? FENChar.WhitePawn : FENChar.BlackPawn;
    this.logo = color === Colors.BLACK ? blackLogo : whiteLogo;
    this.isFirstStep = isFirstStep;
  }

  canMove(board: Board, target: Cell): boolean {
    if (!super.canMove(board, target)) return false;

    const direction: Direction = this.color === Colors.BLACK ? 1 : -1; // TODO temporary decision
    const firstStepDirection: FirstStepDirection = this.color === Colors.BLACK ? 2 : -2;

    // if non-beating move
    if (target.x === this.x) {
      // if first step
      if (
        this.isFirstStep &&
        target.y === this.y + firstStepDirection &&
        target.isEmpty() &&
        board.getCell(target.x, target.y - direction).isEmpty()
      ) {
        return true;
      }

      if (target.y === this.y + direction && board.getCell(target.x, target.y).isEmpty()) {
        return true;
      }
    }

    // if beating move
    if (
      (this.isCellUnderAttack(target) && board.getCell(this.x, this.y).isEnemy(target)) ||
      this.canCaptureEnPassant(target, board.lastMove)
    ) {
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

  canCaptureEnPassant(target: Cell, lastMove: LastMove | null): boolean {
    if (!lastMove) return false;
    const { figure, prevY } = lastMove;
    const direction: Direction = this.color === Colors.BLACK ? 1 : -1;

    if (
      figure instanceof Pawn &&
      Math.abs(figure.y - prevY) === 2 &&
      Math.abs(this.x - figure.x) === 1 &&
      this.y === figure.y &&
      target.y === figure.y + direction &&
      target.x === figure.x
    ) {
      return true;
    }

    return false;
  }

  isEnPassantCapture(lastMove: LastMove): boolean {
    const { figure, prevY } = lastMove;
    const direction: Direction = this.color === Colors.BLACK ? 1 : -1;

    if (
      figure instanceof Pawn &&
      Math.abs(figure.y - prevY) === 2 &&
      Math.abs(this.y - figure.y) === 1 &&
      this.y === figure.y + direction &&
      this.x === figure.x
    ) {
      return true;
    }

    return false;
  }

  public isPromotionMove = (newY: number) => newY === 0 || newY === 7;

  // added moveFigure function for the pawn to track the first move
  moveFigure() {
    this.isFirstStep = false;
  }

  clone() {
    return new Pawn(this.x, this.y, this.color, this.isFirstStep, this.id);
  }
}
