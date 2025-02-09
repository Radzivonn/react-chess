import { useMoveListStore } from 'store/useMoveList';

const MoveHistoryTable = () => {
  const { moveList, selectedMoveIndex, setSelectedMoveIndex } = useMoveListStore();

  return (
    <div className="move-table">
      {moveList.map((movePair, i) => (
        <div className="move-table__row" key={movePair[0] + movePair[1] + i}>
          <div className="move-table__column--row-number">{i + 1}</div>
          {movePair.map((move, j) => {
            const moveNumber = 2 * i + j + 1;
            return (
              <div
                key={moveNumber}
                className={`move-table__column ${moveNumber === selectedMoveIndex ? 'active' : ''}`}
                onClick={() => setSelectedMoveIndex(moveNumber)}
              >
                {move}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default MoveHistoryTable;
