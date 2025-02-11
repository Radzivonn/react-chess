import React, { FC, MouseEvent } from 'react';
import { Colors, FENChar, figureImagePaths } from 'types/enums';

interface Props {
  setIsDialogActive: (isDialogActive: boolean) => void;
  selectColor: (color: Colors) => void;
}

const PlayerColorSelectionDialog: FC<Props> = ({ selectColor, setIsDialogActive }) => {
  const onSelect = (event: MouseEvent) => {
    const figureChar = event.currentTarget.id;
    selectColor(figureChar === FENChar.WhiteKing ? Colors.WHITE : Colors.BLACK);
  };

  return (
    <div className="dialog-bg">
      <div className="dialog">
        <img
          id={FENChar.WhiteKing}
          onClick={(e) => onSelect(e)}
          src={figureImagePaths[FENChar.WhiteKing]}
          alt="figure"
        />
        <img
          id={FENChar.BlackKing}
          onClick={(e) => onSelect(e)}
          src={figureImagePaths[FENChar.BlackKing]}
          alt="figure"
        />
        <div id="cross" onClick={() => setIsDialogActive(false)}></div>
      </div>
    </div>
  );
};

export default PlayerColorSelectionDialog;
