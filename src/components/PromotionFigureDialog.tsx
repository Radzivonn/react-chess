import { FC, MouseEvent } from 'react';
import { Colors, FENChar } from 'types/enums';
import whiteQueenLogo from 'assets/white-queen.svg';
import whiteRookLogo from 'assets/white-rook.svg';
import whiteBishopLogo from 'assets/white-bishop.svg';
import whiteKnightLogo from 'assets/white-knight.svg';
import blackQueenLogo from 'assets/black-queen.svg';
import blackRookLogo from 'assets/black-rook.svg';
import blackBishopLogo from 'assets/black-bishop.svg';
import blackKnightLogo from 'assets/black-knight.svg';

interface Props {
  color: Colors;
  setIsPromotionDialogActive: (isPromotionDialogActive: boolean) => void;
  selectPromotedFigure: (figure: FENChar | undefined) => void;
}

export const PromotionFigureDialog: FC<Props> = ({
  color,
  setIsPromotionDialogActive,
  selectPromotedFigure,
}) => {
  const isBlack = color === Colors.BLACK;

  const selectFigure = (event: MouseEvent) => {
    selectPromotedFigure(event.currentTarget.id as FENChar);
  };

  return (
    <div className="promotion-dialog-bg">
      <div className="promotion-dialog">
        <img
          id={isBlack ? FENChar.BlackQueen : FENChar.WhiteQueen}
          onClick={(e) => selectFigure(e)}
          src={isBlack ? blackQueenLogo : whiteQueenLogo}
          alt="figure"
        />
        <img
          id={isBlack ? FENChar.BlackRook : FENChar.WhiteRook}
          onClick={(e) => selectFigure(e)}
          src={isBlack ? blackRookLogo : whiteRookLogo}
          alt="figure"
        />
        <img
          id={isBlack ? FENChar.BlackBishop : FENChar.WhiteBishop}
          onClick={(e) => selectFigure(e)}
          src={isBlack ? blackBishopLogo : whiteBishopLogo}
          alt="figure"
        />
        <img
          id={isBlack ? FENChar.BlackKnight : FENChar.WhiteKnight}
          onClick={(e) => selectFigure(e)}
          src={isBlack ? blackKnightLogo : whiteKnightLogo}
          alt="figure"
        />
        <div id="cross" onClick={() => setIsPromotionDialogActive(false)}></div>
      </div>
    </div>
  );
};
