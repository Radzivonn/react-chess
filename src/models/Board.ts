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
  checkState = false;
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
          row.push(new Cell(x, y, Colors.BLACK, null));
        } else {
          row.push(new Cell(x, y, Colors.WHITE, null));
        }
      }
      this.cells.push(row);
    }
  }

  public getCell(x: number, y: number) {
    return this.cells[y][x];
  }

  public resetCellAvailabilityFlags(): void {
    for (let y = 0; y < this.cells.length; y++) {
      const row = this.cells[y];
      for (let x = 0; x < row.length; x++) {
        const target = row[x];
        target.available = false;
      }
    }
  }

  public getCopyBoard(playerColor: Colors, checkState: boolean): Board {
    const newBoard = new Board();
    /* заменить на глубокое копирование объекта */
    newBoard.currentPlayerColor = playerColor;
    newBoard.checkState = checkState;
    newBoard.cells = this.cells;
    newBoard.lostWhiteFigures = this.lostWhiteFigures;
    newBoard.lostBlackFigures = this.lostBlackFigures;
    newBoard.blackFigures = this.blackFigures;
    newBoard.whiteFigures = this.whiteFigures;
    /* заменить на глубокое копирование объекта */
    return newBoard;
  }

  isDraw() {
    if (this.blackFigures.length === 1 && this.whiteFigures.length === 1) return true;
    if (
      this.blackFigures.length === 2 &&
      this.whiteFigures.length === 1 &&
      this.blackFigures.find((f) => f.name === FigureNames.KNIGHT)
    ) {
      return true;
    }
    if (
      this.whiteFigures.length === 2 &&
      this.blackFigures.length === 1 &&
      this.whiteFigures.find((f) => f.name === FigureNames.KNIGHT)
    ) {
      return true;
    }
    if (
      (this.blackFigures.length > 1 && this.whiteFigures.length > 1) ||
      this.blackFigures.length > 1 ||
      this.whiteFigures.length > 1
    ) {
      const bishops: Figure[] = [];
      for (const figure of [...this.blackFigures, ...this.whiteFigures]) {
        if (figure.name === FigureNames.BISHOP) bishops.push(figure);
        else if (figure.name !== FigureNames.KING) return false;
      }
      return (
        bishops.length ===
          bishops.filter((f) => this.getCell(f.x, f.y).color === Colors.BLACK).length ||
        bishops.length ===
          bishops.filter((f) => this.getCell(f.x, f.y).color === Colors.WHITE).length
      );
    }
    return false;
  }

  isStalemate() {
    if (!this.checkState) {
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const target = row[x];
          if (target.figure?.color === this.currentPlayerColor && this.countAvailableCells(target))
            return false;
        }
      }
      return true;
    }
    return false;
  }

  isCheckMate() {
    if (this.checkState) {
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const target = row[x];
          if (target.figure?.color === this.currentPlayerColor && this.countAvailableCells(target))
            return false;
        }
      }
      return true;
    }
    return false;
  }

  private replaceFigures(figure: Figure) {
    if (figure.color === Colors.BLACK) {
      this.blackFigures.splice(
        this.blackFigures.findIndex((f) => f.id === figure.id),
        1,
        figure,
      );
    } else {
      this.whiteFigures.splice(
        this.whiteFigures.findIndex((f) => f.id === figure.id),
        1,
        figure,
      );
    }
  }

  isInCheck(opponentFigures: Figure[]) {
    for (const figure of opponentFigures) {
      const isPawn = figure.name === FigureNames.PAWN;
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const target = row[x];
          const isKingTarget =
            target.figure?.color !== figure.color && target.figure?.name === FigureNames.KING;

          if (isKingTarget && isPawn && figure.isCellUnderAttack(target)) {
            return true;
          } else if (isKingTarget && !isPawn && figure.canMove(this, target)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isPositionSafeAfterMove(currentCell: Cell, targetCell: Cell) {
    if (!currentCell.figure) return false;

    const currentFigureClone = currentCell.figure.clone();
    const targetFigureClone = targetCell.figure ? targetCell.figure.clone() : null;

    currentCell.figure.x = targetCell.x;
    currentCell.figure.y = targetCell.y;

    this.cells[targetCell.y][targetCell.x].figure = currentCell.figure;
    this.cells[currentCell.y][currentCell.x].figure = null;

    let opponentFigures =
      this.currentPlayerColor === Colors.BLACK ? this.whiteFigures : this.blackFigures;
    opponentFigures = opponentFigures.filter((f) => f.id !== targetFigureClone?.id); // exclude the captured piece in case of a move

    const isInCheck = this.isInCheck(opponentFigures);

    this.cells[currentCell.y][currentCell.x].figure = currentFigureClone;
    this.cells[targetCell.y][targetCell.x].figure = targetFigureClone;

    this.replaceFigures(currentFigureClone);
    if (targetFigureClone) this.replaceFigures(targetFigureClone);

    return !isInCheck;
  }

  countAvailableCells(selectedCell: Cell) {
    let hasAvailableCells = false;
    for (let y = 0; y < this.cells.length; y++) {
      const row = this.cells[y];
      for (let x = 0; x < row.length; x++) {
        const target = row[x];
        let isPositionSafeAfterMove = false;
        const isFigureCanMove = !!selectedCell?.figure?.canMove(this, target);
        if (isFigureCanMove) {
          isPositionSafeAfterMove = this.isPositionSafeAfterMove(selectedCell, target);
        }
        if (isFigureCanMove && isPositionSafeAfterMove) {
          target.available = true;
          hasAvailableCells = true;
        }
      }
    }
    return hasAvailableCells;
  }

  public highlightCells(selectedCell: Cell) {
    if (selectedCell.figure) this.countAvailableCells(selectedCell);
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
    const currentFigure = currentCell.figure;
    if (currentFigure) {
      currentFigure.moveFigure();

      if (target.figure) this.addLostFigure(target.figure.clone());

      currentFigure.x = target.x;
      currentFigure.y = target.y;

      target.figure = currentFigure.clone();

      if (currentFigure.color === Colors.BLACK) {
        const figureIndex = this.blackFigures.findIndex((f) => f.id === currentFigure.id);
        if (figureIndex) this.blackFigures[figureIndex] = target.figure;
      } else {
        const figureIndex = this.whiteFigures.findIndex((f) => f.id === currentFigure.id);
        if (figureIndex) this.whiteFigures[figureIndex] = target.figure;
      }

      currentCell.figure = null;
    }
  }

  isEmptyVertical(currentX: number, currentY: number, targetX: number, targetY: number): boolean {
    if (currentX !== targetX) {
      return false;
    }

    const min = Math.min(currentY, targetY);
    const max = Math.max(currentY, targetY);
    for (let y = min + 1; y < max; y++) {
      if (!this.getCell(currentX, y).isEmpty()) return false;
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
      if (!this.getCell(x, currentY).isEmpty()) return false;
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
      if (!this.getCell(currentX + dx * i, currentY + dy * i).isEmpty()) {
        return false;
      }
    }
    return true;
  }

  private addPawns() {
    for (let i = 0; i < 8; i++) {
      const blackPawn = new Pawn(i, 1, Colors.BLACK, true);
      this.cells[1][i].figure = blackPawn;
      this.blackFigures.push(blackPawn);

      const whitePawn = new Pawn(i, 6, Colors.WHITE, true);
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
    this.addKings();
    this.addQueens();
    this.addBishops();
    this.addKnights();
    this.addRooks();
    this.addPawns();
  }
}
