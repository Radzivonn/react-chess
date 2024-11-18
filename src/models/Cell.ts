import { Colors } from 'types/enums';
import { Figure } from './figures/Figure';
import { Board } from './Board';

export class Cell {
  readonly color: Colors;
  readonly x: number;
  readonly y: number;
  figure: Figure | null;
  board: Board;
  available: boolean; // Can you move onto a square
  id: number; // For react keys

  constructor(board: Board, x: number, y: number, color: Colors, figure: Figure | null) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.figure = figure;
    this.board = board;
    this.available = false;
    this.id = Math.random();
  }

  isEmpty(): boolean {
    return this.figure === null;
  }

  isEnemy(target: Cell): boolean {
    if (target.figure && this.figure) {
      return this.figure.color !== target.figure.color;
    }
    return false;
  }

  isEmptyVertical(targetX: number, targetY: number): boolean {
    if (this.x !== targetX) {
      return false;
    }

    const min = Math.min(this.y, targetY);
    const max = Math.max(this.y, targetY);
    for (let y = min + 1; y < max; y++) {
      if (!this.board.getCell(this.x, y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyHorizontal(targetX: number, targetY: number): boolean {
    if (this.y !== targetY) {
      return false;
    }

    const min = Math.min(this.x, targetX);
    const max = Math.max(this.x, targetX);
    for (let x = min + 1; x < max; x++) {
      if (!this.board.getCell(x, this.y).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  isEmptyDiagonal(targetX: number, targetY: number): boolean {
    const absX = Math.abs(targetX - this.x);
    const absY = Math.abs(targetY - this.y);
    if (absY !== absX) return false;

    const dy = this.y < targetY ? 1 : -1;
    const dx = this.x < targetX ? 1 : -1;

    for (let i = 1; i < absY; i++) {
      if (!this.board.getCell(this.x + dx * i, this.y + dy * i).isEmpty()) return false;
    }
    return true;
  }

  setFigure(figure: Figure) {
    this.figure = figure;
    this.figure.cell = this;
  }

  addLostFigure(figure: Figure) {
    if (figure.color === Colors.BLACK) this.board.lostBlackFigures.push(figure);
    else this.board.lostWhiteFigures.push(figure);
  }

  moveFigure(target: Cell) {
    // *** проверка уже была в BoardComponent selectedCell.figure?.canMove
    if (this.figure && this.figure?.canMove(target)) {
      this.figure.moveFigure();

      if (target.figure) this.addLostFigure(target.figure);

      target.setFigure(this.figure);
      this.figure = null;
    }
  }
}
