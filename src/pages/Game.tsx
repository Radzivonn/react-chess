import BoardModule from 'modules/Board';
import Timer from 'modules/Timer';
import { FinishGameMessage } from 'components/FinishGameMessage';
import MoveHistoryTable from 'modules/MoveHistoryTable';
import { CheckChessBoardAvailability } from 'hocs/CheckChessBoardAvailability';
import { CheckIsGameFinished } from 'hocs/CheckIsGameFinished';

const Game = () => {
  return (
    <div className="game">
      <Timer />
      <CheckChessBoardAvailability>
        <BoardModule />
      </CheckChessBoardAvailability>
      <MoveHistoryTable />
      <CheckIsGameFinished>
        <FinishGameMessage />
      </CheckIsGameFinished>
    </div>
  );
};

export default Game;
