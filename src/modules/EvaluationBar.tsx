import { useGameStateStore } from 'store/useGameState';

const EvaluationBar = () => {
  const evaluation = useGameStateStore((state) => state.evaluation);

  return (
    <div className={`evaluation-bar`}>
      <div
        className="white-bar"
        style={{
          transform: `scaleY(${evaluation})`,
        }}
      ></div>
    </div>
  );
};

export default EvaluationBar;
