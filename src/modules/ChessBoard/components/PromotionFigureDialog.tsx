import { FC, MouseEvent } from 'react';
import { Colors, FENChar, figureImagePaths } from 'types/enums';
import isEnumValue from 'helpers/CheckIsEnumValue';
import Dialog from 'components/Dialog';

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
    const figureChar = event.currentTarget.id;
    if (isEnumValue(FENChar, figureChar)) selectPromotedFigure(figureChar);
  };

  return (
    <Dialog>
      <img
        id={isBlack ? FENChar.BlackQueen : FENChar.WhiteQueen}
        onClick={(e) => selectFigure(e)}
        src={isBlack ? figureImagePaths[FENChar.BlackQueen] : figureImagePaths[FENChar.WhiteQueen]}
        alt="figure"
      />
      <img
        id={isBlack ? FENChar.BlackRook : FENChar.WhiteRook}
        onClick={(e) => selectFigure(e)}
        src={isBlack ? figureImagePaths[FENChar.BlackRook] : figureImagePaths[FENChar.WhiteRook]}
        alt="figure"
      />
      <img
        id={isBlack ? FENChar.BlackBishop : FENChar.WhiteBishop}
        onClick={(e) => selectFigure(e)}
        src={
          isBlack ? figureImagePaths[FENChar.BlackBishop] : figureImagePaths[FENChar.WhiteBishop]
        }
        alt="figure"
      />
      <img
        id={isBlack ? FENChar.BlackKnight : FENChar.WhiteKnight}
        onClick={(e) => selectFigure(e)}
        src={
          isBlack ? figureImagePaths[FENChar.BlackKnight] : figureImagePaths[FENChar.WhiteKnight]
        }
        alt="figure"
      />
      <div id="cross" onClick={() => setIsPromotionDialogActive(false)}></div>
    </Dialog>
  );
};
