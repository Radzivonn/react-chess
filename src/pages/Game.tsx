import Timer from 'modules/Timer';
import MoveHistoryTable from 'modules/MoveHistoryTable';
import { ChessBoard } from 'hocs/ChessBoard';
import { CheckIsGameFinished } from 'hocs/CheckIsGameFinished';
import EvaluationBar from 'modules/EvaluationBar';

const Game = () => {
  return (
    <div className="game">
      <Timer />
      <EvaluationBar />
      <ChessBoard />
      <MoveHistoryTable />
      <CheckIsGameFinished />
    </div>
  );
};

export default Game;
