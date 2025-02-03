import { figureCosts } from 'types/enums';
import { boardFENCharState } from 'types/types';

/**
 * @param board Array of pieces placement on the board in FENChar format and null if the cell at a given coordinate is empty.
 * @returns sum of figures weights.
 * White figures have positive weights, and black figures have negative weights.
 * If the sum is positive, then the material advantage is in the direction of White,
 * and if it is negative - in the direction of Black.
 */
const evaluate = (board: boardFENCharState): number => {
  const totalCost = board.reduce(
    (cost, row) => cost + row.reduce((acc, curr) => (curr ? acc + figureCosts[curr] : acc), 0),
    0,
  );
  return totalCost;
};

export default evaluate;
