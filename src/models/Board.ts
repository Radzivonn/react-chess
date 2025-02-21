import { Cell } from './Cell';
import { FENConverter } from './FENConverter';
import { Colors, FENChar, MoveType } from 'types/enums';
import { columns, Coords, GameHistory, LastMove, MoveList } from 'types/types';
import { Pawn } from './figures/Pawn';
import { King } from './figures/King';
import { Queen } from './figures/Queen';
import { Bishop } from './figures/Bishop';
import { Knight } from './figures/Knight';
import { Rook } from './figures/Rook';
import { Figure } from './figures/Figure';

export class Board {
  private fiftyMoveRuleCounter: number = 0;
  private threeFoldRepetitionDictionary = new Map<string, number>();
  private threeFoldRepetitionFlag: boolean = false;
  private boardAsFEN: string = FENConverter.initialPosition;
  private FENConverter = new FENConverter();

  fullNumberOfMoves: number = 0;
  boardOrientation: Colors = Colors.WHITE;
  currentPlayerColor = Colors.WHITE;
  checkState = false;
  cells: Cell[][] = [];
  blackFigures: Figure[] = [];
  whiteFigures: Figure[] = [];
  lostBlackFigures: Figure[] = [];
  lostWhiteFigures: Figure[] = [];
  lastMove: LastMove | null = null;
  gameOverMessage: string | null = null;
  moveList: MoveList = [];
  gameHistory: GameHistory = [];

  public get chessBoardView(): (FENChar | null)[][] {
    return this.cells.map((row) => {
      return row.map((cell) => (cell.figure instanceof Figure ? cell.figure.FENChar : null));
    });
  }

  public get boardFENFormat(): string {
    return this.boardAsFEN;
  }

  public get playerColor(): Colors {
    return this.boardOrientation;
  }

  public get ROWS_NUMBERS(): string[] {
    return this.boardOrientation === Colors.WHITE
      ? ['8', '7', '6', '5', '4', '3', '2', '1']
      : ['1', '2', '3', '4', '5', '6', '7', '8'];
  }

  public get COLUMNS_LETTERS(): string[] {
    return this.boardOrientation === Colors.WHITE ? columns : columns.toReversed();
  }

  public restartGame(boardOrientation?: Colors): void {
    this.boardOrientation = boardOrientation ? boardOrientation : this.boardOrientation;
    this.initCells();
    this.addFigures();
    this.gameHistory.push({
      board: this.chessBoardView,
      capturedBlackFigures: [],
      capturedWhiteFigures: [],
      lastMove: this.lastMove,
      checkState: this.checkState,
    });
  }

  private initCells(): void {
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

  public getCell(x: number, y: number): Cell {
    return this.cells[y][x];
  }

  public getCellByMoveNotation(move: string): Cell {
    const x = this.COLUMNS_LETTERS.indexOf(move[0]);
    const y = this.ROWS_NUMBERS.indexOf(move[1]);
    return this.getCell(x, y);
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

  public isGameFinished(): boolean {
    if (this.insufficientMaterial()) {
      this.gameOverMessage = 'Draw due insufficient material';
      return true;
    }

    if (this.isCheckMate()) {
      this.gameOverMessage = `${this.currentPlayerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE} won by checkmate`;
      return true;
    }

    if (this.isStalemate()) {
      this.gameOverMessage = 'Stalemate';
      return true;
    }

    if (this.threeFoldRepetitionFlag) {
      this.gameOverMessage = 'Draw due three fold repetition rule';
      return true;
    }

    if (this.fiftyMoveRuleCounter === 50) {
      this.gameOverMessage = 'Draw due fifty move rule';
      return true;
    }

    return false;
  }

  private playerHasOnlyTwoKnightsAndKing(figures: Figure[]): boolean {
    return figures.filter((figure) => figure instanceof Knight).length === 2;
  }

  private playerHasOnlyBishopsWithSameColorAndKing(figures: Figure[]): boolean {
    const bishops = figures.filter((figure) => figure instanceof Bishop);
    const areAllBishopsOfSameColor =
      new Set(bishops.map((bishop) => this.getCell(bishop.x, bishop.y).color === Colors.WHITE))
        .size === 1;
    return bishops.length === figures.length - 1 && areAllBishopsOfSameColor;
  }

  private insufficientMaterial(): boolean {
    // King vs King
    if (this.blackFigures.length === 1 && this.whiteFigures.length === 1) return true;

    // King and Minor Piece vs King
    if (this.blackFigures.length === 2 && this.whiteFigures.length === 1) {
      return this.blackFigures.some(
        (figure) => figure instanceof Knight || figure instanceof Bishop,
      );
    }

    if (this.whiteFigures.length === 2 && this.blackFigures.length === 1) {
      return this.whiteFigures.some(
        (figure) => figure instanceof Knight || figure instanceof Bishop,
      );
    }

    // both sides have bishop of same color
    if (this.whiteFigures.length === 2 && this.blackFigures.length === 2) {
      const whiteBishop = this.whiteFigures.find((figure) => figure instanceof Bishop);
      const blackBishop = this.blackFigures.find((figure) => figure instanceof Bishop);

      if (whiteBishop && blackBishop) {
        return (
          this.getCell(whiteBishop.x, whiteBishop.y).color ===
          this.getCell(blackBishop.x, blackBishop.y).color
        );
      }
    }

    if (
      (this.whiteFigures.length === 3 &&
        this.blackFigures.length === 1 &&
        this.playerHasOnlyTwoKnightsAndKing(this.whiteFigures)) ||
      (this.whiteFigures.length === 1 &&
        this.blackFigures.length === 3 &&
        this.playerHasOnlyTwoKnightsAndKing(this.blackFigures))
    ) {
      return true;
    }

    if (
      (this.whiteFigures.length >= 3 &&
        this.blackFigures.length === 1 &&
        this.playerHasOnlyBishopsWithSameColorAndKing(this.whiteFigures)) ||
      (this.whiteFigures.length === 1 &&
        this.blackFigures.length >= 3 &&
        this.playerHasOnlyBishopsWithSameColorAndKing(this.blackFigures))
    ) {
      return true;
    }

    return false;
  }

  isStalemate(): boolean {
    if (!this.checkState) {
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];

          if (
            cell.figure?.color === this.currentPlayerColor &&
            this.countAvailableCells(cell).length > 0
          ) {
            return false;
          }
        }
      }
      return true;
    }
    return false;
  }

  isCheckMate(): boolean {
    if (this.checkState) {
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const cell = row[x];

          if (
            cell.figure?.color === this.currentPlayerColor &&
            this.countAvailableCells(cell).length > 0
          )
            return false;
        }
      }
      return true;
    }
    return false;
  }

  isInCheck(opponentFigures: Figure[]): boolean {
    for (const figure of opponentFigures) {
      for (let y = 0; y < this.cells.length; y++) {
        const row = this.cells[y];
        for (let x = 0; x < row.length; x++) {
          const target = row[x];
          const isKingTarget =
            target.figure?.color !== figure.color && target.figure instanceof King;

          if (
            isKingTarget &&
            figure instanceof Pawn &&
            figure.isCellUnderAttack(target, this.boardOrientation)
          ) {
            return true;
          } else if (isKingTarget && !(figure instanceof Pawn) && figure.canMove(this, target)) {
            return true;
          }
        }
      }
    }
    return false;
  }

  isPositionSafeAfterMove(currentCell: Cell, targetCell: Cell): boolean {
    if (!currentCell.figure) return false;

    const currentFigureClone = currentCell.figure.clone();
    const targetFigureClone = targetCell.figure ? targetCell.figure.clone() : null;

    currentCell.figure.x = targetCell.x;
    currentCell.figure.y = targetCell.y;

    this.cells[targetCell.y][targetCell.x].figure = currentCell.figure;
    this.cells[currentCell.y][currentCell.x].figure = null;

    let opponentFigures =
      this.currentPlayerColor === Colors.BLACK ? this.whiteFigures : this.blackFigures;
    opponentFigures = opponentFigures.filter((f) => f.id !== targetFigureClone?.id); // exclude the captured figure in case of a move

    const isInCheck = this.isInCheck(opponentFigures);

    this.cells[currentCell.y][currentCell.x].figure = currentFigureClone;
    this.cells[targetCell.y][targetCell.x].figure = targetFigureClone;

    return !isInCheck;
  }

  countAvailableCells(selectedCell: Cell): Coords[] {
    const availableCells: Coords[] = [];

    for (let y = 0; y < this.cells.length; y++) {
      const row = this.cells[y];

      for (let x = 0; x < row.length; x++) {
        if (!selectedCell.figure) continue;

        const target = row[x];
        const isFigureCanMove = !!selectedCell.figure.canMove(this, target);

        if (isFigureCanMove && this.isPositionSafeAfterMove(selectedCell, target)) {
          target.available = true;
          availableCells.push({ x: target.x, y: target.y });
        }
      }
    }

    return availableCells;
  }

  public highlightCells(selectedCell: Cell): void {
    if (selectedCell.figure) this.countAvailableCells(selectedCell);
  }

  private addLostFigure(figure: Figure): void {
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

  private castle(king: King, kingSideCastle: boolean): void {
    const rookDirection = kingSideCastle ? -1 : 1;
    const rookX = kingSideCastle ? 7 : 0;
    const rook =
      king.color === Colors.BLACK
        ? this.blackFigures.find((f) => f instanceof Rook && f.x === rookX)
        : this.whiteFigures.find((f) => f instanceof Rook && f.x === rookX);

    if (rook) {
      this.moveFigure(this.getCell(rook.x, rook.y), this.getCell(king.x + rookDirection, rook.y));
      this.gameHistory.pop();
      this.moveList[this.moveList.length - 1].pop();
      this.fiftyMoveRuleCounter -= 0.5;
    }
  }

  private getPromotedFigure(
    x: number,
    y: number,
    id: number,
    promotedFigure: FENChar,
  ): Knight | Bishop | Rook | Queen {
    if (promotedFigure === FENChar.WhiteKnight || promotedFigure === FENChar.BlackKnight)
      return new Knight(x, y, this.currentPlayerColor, id);

    if (promotedFigure === FENChar.WhiteBishop || promotedFigure === FENChar.BlackBishop)
      return new Bishop(x, y, this.currentPlayerColor, id);

    if (promotedFigure === FENChar.WhiteRook || promotedFigure === FENChar.BlackRook)
      return new Rook(x, y, this.currentPlayerColor, true, id);

    return new Queen(x, y, this.currentPlayerColor, id);
  }

  public moveFigure(currentCell: Cell, target: Cell, promotedFigure?: FENChar): Board {
    let currentFigure = currentCell.figure;

    if (!currentFigure) return this;

    currentFigure.moveFigure();

    if (currentFigure instanceof Pawn || target.figure) this.fiftyMoveRuleCounter = 0;
    else this.fiftyMoveRuleCounter += 0.5;

    const lastMoveTemp = {
      figure: currentFigure.clone(),
      prevX: currentFigure.x,
      prevY: currentFigure.y,
    };
    lastMoveTemp.figure.x = target.x;
    lastMoveTemp.figure.y = target.y;
    const startFigureCoord = this.startingPieceCoordsNotation(lastMoveTemp);
    const moveType = new Set<MoveType>();

    if (target.figure) {
      this.addLostFigure(target.figure.clone());
      moveType.add(MoveType.Capture);
    }

    if (promotedFigure) {
      currentFigure = this.getPromotedFigure(
        currentFigure.x,
        currentFigure.y,
        currentFigure.id,
        promotedFigure,
      );
      moveType.add(MoveType.Promotion);
    }

    currentFigure.x = target.x;
    currentFigure.y = target.y;

    target.figure = currentFigure.clone();

    if (currentFigure.color === Colors.BLACK) {
      const figureIndex = this.blackFigures.findIndex((f) => f.id === currentFigure?.id);
      if (figureIndex > -1) this.blackFigures[figureIndex] = target.figure.clone();
    } else {
      const figureIndex = this.whiteFigures.findIndex((f) => f.id === currentFigure?.id);
      if (figureIndex > -1) this.whiteFigures[figureIndex] = target.figure.clone();
    }

    // En Passant capture
    if (
      this.lastMove &&
      currentFigure instanceof Pawn &&
      currentFigure.isEnPassantCapture(this.lastMove, this.boardOrientation)
    ) {
      const capturedPawnCell = this.getCell(this.lastMove.figure.x, this.lastMove.figure.y);
      if (capturedPawnCell.figure) {
        this.addLostFigure(capturedPawnCell.figure.clone());
        capturedPawnCell.figure = null;
        moveType.add(MoveType.Capture);
      }
    }

    currentCell.figure = null;

    if (currentFigure instanceof King && currentCell.x - target.x === -2) {
      this.castle(currentFigure, true); // king side castle
      moveType.add(MoveType.Castling);
    } else if (currentFigure instanceof King && currentCell.x - target.x === 2) {
      this.castle(currentFigure, false); // queen side castle
      moveType.add(MoveType.Castling);
    }

    if (this.currentPlayerColor === Colors.WHITE && !moveType.has(MoveType.Castling)) {
      this.fullNumberOfMoves++;
    }

    const nextPlayerColor = !moveType.has(MoveType.Castling)
      ? this.currentPlayerColor === Colors.BLACK
        ? Colors.WHITE
        : Colors.BLACK
      : this.currentPlayerColor;

    const opponentFigures =
      nextPlayerColor === Colors.BLACK ? this.whiteFigures : this.blackFigures;

    this.checkState = this.isInCheck(opponentFigures);
    this.currentPlayerColor = nextPlayerColor;
    const isGameFinished = this.isGameFinished();

    if (this.checkState && isGameFinished) moveType.add(MoveType.CheckMate);
    else if (this.checkState) moveType.add(MoveType.Check);
    else if (!moveType.size) moveType.add(MoveType.BasicMove);

    this.lastMove = {
      ...lastMoveTemp,
      moveType,
    };
    this.boardAsFEN = this.FENConverter.convertBoardToFEN(this, this.fiftyMoveRuleCounter);

    this.updateThreeFoldRepetitionDictionary(this.boardAsFEN);
    this.storeMove(startFigureCoord, promotedFigure);
    this.updateGameHistory();
    this.resetCellAvailabilityFlags();

    return this;
  }

  private updateThreeFoldRepetitionDictionary(FEN: string): void {
    const threeFoldRepetitionFENKey: string = FEN.split(' ').slice(0, 4).join('');
    const threeFoldRepetitionValue: number | undefined =
      this.threeFoldRepetitionDictionary.get(threeFoldRepetitionFENKey);

    if (!threeFoldRepetitionValue) {
      this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey, 1);
    } else {
      if (threeFoldRepetitionValue === 2) {
        this.threeFoldRepetitionFlag = true;
        return;
      }
      this.threeFoldRepetitionDictionary.set(threeFoldRepetitionFENKey, 2);
    }
  }

  private storeMove(startFigureCoord: string, promotedFigure?: FENChar): void {
    const { figure, prevX, moveType } = this.lastMove!;
    const figureName =
      figure.FENChar && !(figure instanceof Pawn) ? figure.FENChar.toUpperCase() : '';
    let move = '';

    if (moveType.has(MoveType.Castling)) move = figure.x - prevX === 2 ? 'O-O' : 'O-O-O';
    else {
      move = figureName + startFigureCoord;

      if (moveType.has(MoveType.Capture)) {
        move += figure instanceof Pawn ? this.COLUMNS_LETTERS[prevX] + 'x' : 'x';
      }

      move += this.COLUMNS_LETTERS[figure.x] + this.ROWS_NUMBERS[figure.y];

      if (promotedFigure) move += '=' + promotedFigure.toUpperCase();
    }

    if (moveType.has(MoveType.Check)) move += '+';
    else if (moveType.has(MoveType.CheckMate)) move += '#';

    if (!this.moveList[this.fullNumberOfMoves - 1])
      this.moveList[this.fullNumberOfMoves - 1] = [move];
    else this.moveList[this.fullNumberOfMoves - 1].push(move);
  }

  /**
   * Function returns coordinates according to chess algebraic notation.
   * Pieces of the same type as the selected one are checked and whether they can move to the same squares as the selected piece.
   * According to chess algebraic notation,
   * if there are intersections of cells “available” for movement for several figures of the same type,
   * then the function returns the corresponding coordinates of the specific figure that makes the move.
   */
  private startingPieceCoordsNotation(lastMove: Omit<LastMove, 'moveType'>): string {
    const { figure: currentFigure, prevX, prevY } = lastMove;
    if (currentFigure instanceof Pawn || currentFigure instanceof King) return '';

    const samePiecesCoords: Coords[] = [{ x: prevX, y: prevY }];

    const figures =
      this.currentPlayerColor === Colors.WHITE ? this.whiteFigures : this.blackFigures;

    for (const figure of figures) {
      if (currentFigure.id === figure.id) continue;

      if (figure.FENChar === currentFigure.FENChar) {
        const safeSquares: Coords[] = this.countAvailableCells(this.getCell(figure.x, figure.y));
        const figureHasSameTargetSquare: boolean = safeSquares.some(
          (coords) => coords.x === currentFigure.x && coords.y === currentFigure.y,
        );
        if (figureHasSameTargetSquare) samePiecesCoords.push({ x: figure.x, y: figure.y });
      }
    }

    if (samePiecesCoords.length === 1) return '';

    const piecesFile = new Set(samePiecesCoords.map((coords) => coords.x));
    const piecesRank = new Set(samePiecesCoords.map((coords) => coords.y));

    // means that all of the pieces are on different verticals (a, b, c, ...)
    if (piecesFile.size === samePiecesCoords.length) return this.COLUMNS_LETTERS[prevX];

    // means that all of the pieces are on different horizontals (1, 2, 3, ...)
    if (piecesRank.size === samePiecesCoords.length) return this.ROWS_NUMBERS[prevY];

    // in case that there are pieces that shares both verticals and horizontals with multiple or one piece
    return this.COLUMNS_LETTERS[prevX] + this.ROWS_NUMBERS[prevY];
  }

  private getFiguresFENCharArray(figures: Figure[]): FENChar[] {
    return figures.reduce((res: FENChar[], f) => (f.FENChar ? [...res, f.FENChar] : res), []);
  }

  private updateGameHistory(): void {
    this.gameHistory.push({
      board: [...this.chessBoardView.map((row) => [...row])],
      capturedBlackFigures: this.getFiguresFENCharArray(this.lostBlackFigures),
      capturedWhiteFigures: this.getFiguresFENCharArray(this.lostWhiteFigures),
      checkState: this.checkState,
      lastMove: this.lastMove ? { ...this.lastMove } : null,
    });
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
      const playerPawn = new Pawn(i, 6, this.playerColor, true);
      this.cells[6][i].figure = playerPawn;
      if (this.playerColor === Colors.WHITE) this.whiteFigures.push(playerPawn.clone());
      else this.blackFigures.push(playerPawn.clone());

      const anotherColor = this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

      const anotherPawn = new Pawn(i, 1, anotherColor, true);
      this.cells[1][i].figure = anotherPawn;
      if (anotherColor === Colors.WHITE) this.whiteFigures.push(anotherPawn.clone());
      else this.blackFigures.push(anotherPawn.clone());
    }
  }

  private addKings() {
    const playerKing = new King(4, 7, this.playerColor, false);
    const anotherKing = new King(
      4,
      0,
      this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE,
      false,
    );

    this.cells[7][4].figure = playerKing;
    this.cells[0][4].figure = anotherKing;

    if (this.playerColor === Colors.WHITE) {
      this.whiteFigures.push(playerKing.clone());
      this.blackFigures.push(anotherKing.clone());
    } else {
      this.blackFigures.push(playerKing.clone());
      this.whiteFigures.push(anotherKing.clone());
    }
  }

  private addQueens() {
    const playerQueen = new Queen(3, 7, this.playerColor);
    const anotherQueen = new Queen(
      3,
      0,
      this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE,
    );

    this.cells[7][3].figure = playerQueen;
    this.cells[0][3].figure = anotherQueen;

    if (this.playerColor === Colors.WHITE) {
      this.whiteFigures.push(playerQueen.clone());
      this.blackFigures.push(anotherQueen.clone());
    } else {
      this.blackFigures.push(playerQueen.clone());
      this.whiteFigures.push(anotherQueen.clone());
    }
  }

  private addBishops() {
    const playerBishop = new Bishop(2, 7, this.playerColor);
    const playerBishop2 = new Bishop(5, 7, this.playerColor);

    const anotherColor = this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

    const anotherBishop = new Bishop(2, 0, anotherColor);
    const anotherBishop2 = new Bishop(5, 0, anotherColor);

    this.cells[7][2].figure = playerBishop;
    this.cells[7][5].figure = playerBishop2;
    this.cells[0][2].figure = anotherBishop;
    this.cells[0][5].figure = anotherBishop2;

    if (this.playerColor === Colors.WHITE) {
      this.whiteFigures.push(playerBishop.clone(), playerBishop2.clone());
      this.blackFigures.push(anotherBishop.clone(), anotherBishop2.clone());
    } else {
      this.blackFigures.push(playerBishop.clone(), playerBishop2.clone());
      this.whiteFigures.push(anotherBishop.clone(), anotherBishop2.clone());
    }
  }

  private addKnights() {
    const playerKnight = new Knight(1, 7, this.playerColor);
    const playerKnight2 = new Knight(6, 7, this.playerColor);

    const anotherColor = this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

    const anotherKnight = new Knight(1, 0, anotherColor);
    const anotherKnight2 = new Knight(6, 0, anotherColor);

    this.cells[7][1].figure = playerKnight;
    this.cells[7][6].figure = playerKnight2;
    this.cells[0][1].figure = anotherKnight;
    this.cells[0][6].figure = anotherKnight2;

    if (this.playerColor === Colors.WHITE) {
      this.whiteFigures.push(playerKnight.clone(), playerKnight2.clone());
      this.blackFigures.push(anotherKnight.clone(), anotherKnight2.clone());
    } else {
      this.blackFigures.push(playerKnight.clone(), playerKnight2.clone());
      this.whiteFigures.push(anotherKnight.clone(), anotherKnight2.clone());
    }
  }

  private addRooks() {
    const playerRook = new Rook(0, 7, this.playerColor, false);
    const playerRook2 = new Rook(7, 7, this.playerColor, false);

    const anotherColor = this.playerColor === Colors.WHITE ? Colors.BLACK : Colors.WHITE;

    const anotherRook = new Rook(0, 0, anotherColor, false);
    const anotherRook2 = new Rook(7, 0, anotherColor, false);

    this.cells[7][0].figure = playerRook;
    this.cells[7][7].figure = playerRook2;
    this.cells[0][0].figure = anotherRook;
    this.cells[0][7].figure = anotherRook2;

    if (this.playerColor === Colors.WHITE) {
      this.whiteFigures.push(playerRook.clone(), playerRook2.clone());
      this.blackFigures.push(anotherRook.clone(), anotherRook2.clone());
    } else {
      this.blackFigures.push(playerRook.clone(), playerRook2.clone());
      this.whiteFigures.push(anotherRook.clone(), anotherRook2.clone());
    }
  }

  private addFigures() {
    this.addKings();
    this.addRooks();
    this.addQueens();
    this.addBishops();
    this.addKnights();
    this.addPawns();
  }
}
