export enum Colors {
  WHITE = 'white',
  BLACK = 'black',
}

export enum FENChar {
  WhitePawn = 'P',
  WhiteKnight = 'N',
  WhiteBishop = 'B',
  WhiteRook = 'R',
  WhiteQueen = 'Q',
  WhiteKing = 'K',
  BlackPawn = 'p',
  BlackKnight = 'n',
  BlackBishop = 'b',
  BlackRook = 'r',
  BlackQueen = 'q',
  BlackKing = 'k',
}

type FigureCost = 0 | -1 | 1 | -3 | 3 | -5 | 5 | -9 | 9;

export const figureCosts: Readonly<Record<FENChar, FigureCost>> = {
  [FENChar.WhitePawn]: 1,
  [FENChar.WhiteKnight]: 3,
  [FENChar.WhiteBishop]: 3,
  [FENChar.WhiteRook]: 5,
  [FENChar.WhiteQueen]: 9,
  [FENChar.WhiteKing]: 0,
  [FENChar.BlackPawn]: -1,
  [FENChar.BlackKnight]: -3,
  [FENChar.BlackBishop]: -3,
  [FENChar.BlackRook]: -5,
  [FENChar.BlackQueen]: -9,
  [FENChar.BlackKing]: 0,
};

export const figureImagePaths: Readonly<Record<FENChar, string>> = {
  [FENChar.WhitePawn]: '/white-pawn.svg',
  [FENChar.WhiteKnight]: '/white-knight.svg',
  [FENChar.WhiteBishop]: '/white-bishop.svg',
  [FENChar.WhiteRook]: '/white-rook.svg',
  [FENChar.WhiteQueen]: '/white-queen.svg',
  [FENChar.WhiteKing]: '/white-king.svg',
  [FENChar.BlackPawn]: '/black-pawn.svg',
  [FENChar.BlackKnight]: '/black-knight.svg',
  [FENChar.BlackBishop]: '/black-bishop.svg',
  [FENChar.BlackRook]: '/black-rook.svg',
  [FENChar.BlackQueen]: '/black-queen.svg',
  [FENChar.BlackKing]: '/black-king.svg',
};

export const enum MoveType {
  Capture,
  Castling,
  Promotion,
  Check,
  CheckMate,
  BasicMove,
}
