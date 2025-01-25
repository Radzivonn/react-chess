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

export const figureImagePaths: Readonly<Record<FENChar, string>> = {
  [FENChar.WhitePawn]: '/src/assets/white-pawn.svg',
  [FENChar.WhiteKnight]: '/src/assets/white-knight.svg',
  [FENChar.WhiteBishop]: '/src/assets/white-bishop.svg',
  [FENChar.WhiteRook]: '/src/assets/white-rook.svg',
  [FENChar.WhiteQueen]: '/src/assets/white-queen.svg',
  [FENChar.WhiteKing]: '/src/assets/white-king.svg',
  [FENChar.BlackPawn]: '/src/assets/black-pawn.svg',
  [FENChar.BlackKnight]: '/src/assets/black-knight.svg',
  [FENChar.BlackBishop]: '/src/assets/black-bishop.svg',
  [FENChar.BlackRook]: '/src/assets/black-rook.svg',
  [FENChar.BlackQueen]: '/src/assets/black-queen.svg',
  [FENChar.BlackKing]: '/src/assets/black-king.svg',
};

export enum MoveType {
  Capture,
  Castling,
  Promotion,
  Check,
  CheckMate,
  BasicMove,
}
