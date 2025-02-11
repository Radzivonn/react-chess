import { useGameStateStore } from 'store/useGameState';

const mobileBreakPoint = 992;

const EvaluationBar = () => {
  const evaluation = useGameStateStore((state) => state.evaluation);
  const board = useGameStateStore((state) => state.board);
  const isMobileResolution = window.innerWidth < mobileBreakPoint;

  return (
    <div className={`evaluation__bar--${board?.boardOrientation}`}>
      <div
        className="bar"
        style={{
          transform: `${isMobileResolution ? 'scaleX' : 'scaleY'}(${evaluation})`,
        }}
      ></div>
    </div>
  );
};

export default EvaluationBar;
