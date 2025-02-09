import Controls from 'modules/Controls';
import { CheckTimer } from 'hocs/CheckTimer';
import EvaluationBar from 'modules/EvaluationBar';
import { ChessBoard } from 'hocs/ChessBoard';
import MoveHistoryTable from 'modules/MoveHistoryTable';
import { CheckIsGameFinished } from 'hocs/CheckIsGameFinished';
import { CheckIsSettingsOpened } from 'hocs/CheckIsSettingsOpened';

const Game = () => {
  return (
    <div className="game">
      <Controls />
      <CheckTimer />
      <EvaluationBar />
      <ChessBoard />
      <MoveHistoryTable />
      <CheckIsGameFinished />
      <CheckIsSettingsOpened />
    </div>
  );
};

export default Game;
