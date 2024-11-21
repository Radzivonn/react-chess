import { Cell } from './Cell';
import { Colors, FigureNames } from 'types/enums';
import { Pawn } from './figures/Pawn';
import { King } from './figures/King';
import { Queen } from './figures/Queen';
import { Bishop } from './figures/Bishop';
import { Knight } from './figures/Knight';
import { Rook } from './figures/Rook';
import { Figure } from './figures/Figure';

export class Board {
  cells: Cell[][] = [];
  blackFigures: Figure[] = [];
  whiteFigures: Figure[] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];

  public initCells() {
    for (let y = 0; y < 8; y++) {
      const row: Cell[] = [];
      for (let x = 0; x < 8; x++) {
        if ((x + y) % 2 !== 0) {
          row.push(new Cell(this, x, y, Colors.BLACK, null)); // Black cells
        } else {
          row.push(new Cell(this, x, y, Colors.WHITE, null)); // White cells
        }
      }
      this.cells.push(row);
    }
  }

  public resetIsCellUnderAttackFlags(): void {
    for (let y = 0; y < this.cells.length; y++) {
      const row = this.cells[y];
      for (let x = 0; x < row.length; x++) {
        const target = row[x];
        target.isUnderAttack = false;
      }
    }
  }

  public getCopyBoard(): Board {
    const newBoard = new Board();
    /* заменить на глубокое копирование объекта */
    newBoard.cells = this.cells;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.blackFigures = this.blackFigures;
    newBoard.whiteFigures = this.whiteFigures;
    /* заменить на глубокое копирование объекта */
    return newBoard;
  }

  // ! performance fix
  public highlightCells(selectedCell: Cell | null, playerColor: Colors) {
    const isKingSelected = selectedCell?.figure?.name === FigureNames.KING;

    if (isKingSelected) {
      const figures = playerColor === Colors.BLACK ? this.whiteFigures : this.blackFigures;
      figures.forEach((figure) => {
        for (let y = 0; y < this.cells.length; y++) {
          const row = this.cells[y];
          for (let x = 0; x < row.length; x++) {
            const target = row[x];
            if (figure.name === FigureNames.PAWN) {
              if (figure.isCellUnderAttack(target)) target.isUnderAttack = true;
            } else if (figure?.canMove(target, true) && target.figure?.id !== figure.id) {
              target.isUnderAttack = true;
            }
          }
        }
      });
    }

    for (let y = 0; y < this.cells.length; y++) {
      const row = this.cells[y];
      for (let x = 0; x < row.length; x++) {
        const target = row[x];
        const isFigureCanMove = !!selectedCell?.figure?.canMove(target, false);
        if (isKingSelected) {
          target.available = isFigureCanMove && !target.isUnderAttack;
        } else {
          target.available = isFigureCanMove;
        }
      }
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      this.blackFigures.push(new Pawn(Colors.BLACK, this.getCell(i, 1)));
      this.whiteFigures.push(new Pawn(Colors.WHITE, this.getCell(i, 6)));
    }
  }

  private addKings() {
    this.blackFigures.push(new King(Colors.BLACK, this.getCell(4, 0)));
    this.whiteFigures.push(new King(Colors.WHITE, this.getCell(4, 7)));
  }

  private addQueens() {
    this.blackFigures.push(new Queen(Colors.BLACK, this.getCell(3, 0)));
    this.whiteFigures.push(new Queen(Colors.WHITE, this.getCell(3, 7)));
  }

  private addBishops() {
    this.blackFigures.push(new Bishop(Colors.BLACK, this.getCell(2, 0)));
    this.blackFigures.push(new Bishop(Colors.BLACK, this.getCell(5, 0)));
    this.whiteFigures.push(new Bishop(Colors.WHITE, this.getCell(2, 7)));
    this.whiteFigures.push(new Bishop(Colors.WHITE, this.getCell(5, 7)));
  }

  private addKnights() {
    this.blackFigures.push(new Knight(Colors.BLACK, this.getCell(1, 0)));
    this.blackFigures.push(new Knight(Colors.BLACK, this.getCell(6, 0)));
    this.whiteFigures.push(new Knight(Colors.WHITE, this.getCell(1, 7)));
    this.whiteFigures.push(new Knight(Colors.WHITE, this.getCell(6, 7)));
  }

  private addRooks() {
    this.blackFigures.push(new Rook(Colors.BLACK, this.getCell(0, 0)));
    this.blackFigures.push(new Rook(Colors.BLACK, this.getCell(7, 0)));
    this.whiteFigures.push(new Rook(Colors.WHITE, this.getCell(0, 7)));
    this.whiteFigures.push(new Rook(Colors.WHITE, this.getCell(7, 7)));
  }

  public addFigures() {
    this.addPawns();
    this.addKnights();
    this.addKings();
    this.addBishops();
    this.addQueens();
    this.addRooks();
  }
}
