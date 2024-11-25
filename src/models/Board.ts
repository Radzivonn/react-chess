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
  currentPlayerColor = Colors.WHITE;
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
          row.push(new Cell(x, y, Colors.BLACK, null)); // Black cells
        } else {
          row.push(new Cell(x, y, Colors.WHITE, null)); // White cells
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

  public getCopyBoard(playerColor: Colors): Board {
    const newBoard = new Board();
    /* заменить на глубокое копирование объекта */
    newBoard.currentPlayerColor = playerColor;
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
            } else if (figure?.canMove(this, target, true) && target.figure?.id !== figure.id) {
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
        const isFigureCanMove = !!selectedCell?.figure?.canMove(this, target);
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

  isEmptyVertical(currentX: number, currentY: number, targetX: number, targetY: number): boolean {
    if (currentX !== targetX) {
      return false;
    }

    const min = Math.min(currentY, targetY);
    const max = Math.max(currentY, targetY);
    for (let y = min + 1; y < max; y++) {
      if (!this.getCell(currentX, y).isEmpty(this.currentPlayerColor)) return false;
    }
    return true;
  }

  isEmptyHorizontal(currentX: number, currentY: number, targetX: number, targetY: number): boolean {
    if (currentY !== targetY) {
      return false;
    }

    const min = Math.min(currentX, targetX);
    const max = Math.max(currentX, targetX);
    for (let x = min + 1; x < max; x++) {
      if (!this.getCell(x, currentY).isEmpty(this.currentPlayerColor)) return false;
    }
    return true;
  }

  isEmptyDiagonal(currentX: number, currentY: number, targetX: number, targetY: number): boolean {
    const absX = Math.abs(targetX - currentX);
    const absY = Math.abs(targetY - currentY);
    if (absY !== absX) return false;

    const dy = currentY < targetY ? 1 : -1;
    const dx = currentX < targetX ? 1 : -1;

    for (let i = 1; i < absY; i++) {
      if (!this.getCell(currentX + dx * i, currentY + dy * i).isEmpty(this.currentPlayerColor)) {
        return false;
      }
    }
    return true;
  }

  setFigure(target: Cell, figure: Figure) {
    target.figure = figure;

    if (figure.color === Colors.BLACK) {
      const figureIndex = this.blackFigures.findIndex((f) => f.id === figure.id);
      if (figureIndex) this.blackFigures[figureIndex] = target.figure;
    } else {
      const figureIndex = this.whiteFigures.findIndex((f) => f.id === figure.id);
      if (figureIndex) this.whiteFigures[figureIndex] = target.figure;
    }
  }

  addLostFigure(figure: Figure) {
    if (figure.color === Colors.BLACK) {
      this.lostBlackFigures.push(figure);
      this.blackFigures.splice(
        this.blackFigures.findIndex((f) => f.id === figure.id),
        1,
      );
    } else {
      this.lostWhiteFigures.push(figure);
      this.whiteFigures.splice(
        this.whiteFigures.findIndex((f) => f.id === figure.id),
        1,
      );
    }
  }

  moveFigure(currentCell: Cell, target: Cell) {
    if (currentCell.figure) {
      currentCell.figure.moveFigure();

      if (target.figure) this.addLostFigure(target.figure);

      currentCell.figure.x = target.x;
      currentCell.figure.y = target.y;

      this.setFigure(target, currentCell.figure);

      currentCell.figure = null;
    }
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      const blackPawn = new Pawn(i, 1, Colors.BLACK);
      this.cells[1][i].figure = blackPawn;
      this.blackFigures.push(blackPawn);

      const whitePawn = new Pawn(i, 6, Colors.WHITE);
      this.cells[6][i].figure = whitePawn;
      this.whiteFigures.push(whitePawn);
    }
  }

  private addKings() {
    const blackKing = new King(4, 0, Colors.BLACK);
    const whiteKing = new King(4, 7, Colors.WHITE);

    this.cells[0][4].figure = blackKing;
    this.cells[7][4].figure = whiteKing;
    this.blackFigures.push(blackKing);
    this.whiteFigures.push(whiteKing);
  }

  private addQueens() {
    const blackQueen = new Queen(3, 0, Colors.BLACK);
    const whiteQueen = new Queen(3, 7, Colors.WHITE);

    this.cells[0][3].figure = blackQueen;
    this.cells[7][3].figure = whiteQueen;
    this.blackFigures.push(blackQueen);
    this.whiteFigures.push(whiteQueen);
  }

  private addBishops() {
    const blackBishop = new Bishop(2, 0, Colors.BLACK);
    const blackBishop2 = new Bishop(5, 0, Colors.BLACK);
    const whiteBishop = new Bishop(2, 7, Colors.WHITE);
    const whiteBishop2 = new Bishop(5, 7, Colors.WHITE);

    this.cells[0][2].figure = blackBishop;
    this.cells[0][5].figure = blackBishop2;
    this.cells[7][2].figure = whiteBishop;
    this.cells[7][5].figure = whiteBishop2;

    this.blackFigures.push(blackBishop, blackBishop2);
    this.whiteFigures.push(whiteBishop, whiteBishop2);
  }

  private addKnights() {
    const blackKnight = new Knight(1, 0, Colors.BLACK);
    const blackKnight2 = new Knight(6, 0, Colors.BLACK);
    const whiteKnight = new Knight(1, 7, Colors.WHITE);
    const whiteKnight2 = new Knight(6, 7, Colors.WHITE);

    this.cells[0][1].figure = blackKnight;
    this.cells[0][6].figure = blackKnight2;
    this.cells[7][1].figure = whiteKnight;
    this.cells[7][6].figure = whiteKnight2;

    this.blackFigures.push(blackKnight, blackKnight2);
    this.whiteFigures.push(whiteKnight, whiteKnight2);
  }

  private addRooks() {
    const blackRook = new Rook(0, 0, Colors.BLACK);
    const blackRook2 = new Rook(7, 0, Colors.BLACK);
    const whiteRook = new Rook(0, 7, Colors.WHITE);
    const whiteRook2 = new Rook(7, 7, Colors.WHITE);

    this.cells[0][0].figure = blackRook;
    this.cells[0][7].figure = blackRook2;
    this.cells[7][0].figure = whiteRook;
    this.cells[7][7].figure = whiteRook2;

    this.blackFigures.push(blackRook, blackRook2);
    this.whiteFigures.push(whiteRook, whiteRook2);
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
