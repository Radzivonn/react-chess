import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { MoveList } from 'types/types';

interface MoveListStore {
  moveList: MoveList;
  setMoveList: (moveList: MoveList) => void;
  selectedMoveIndex: number; // selected move from the move table
  setSelectedMoveIndex: (index: number) => void;
}

export const useMoveListStore = create<MoveListStore>()(
  devtools((set) => ({
    moveList: [],
    setMoveList: (moveList) => set(() => ({ moveList })),
    selectedMoveIndex: 0,
    setSelectedMoveIndex: (index) => set(() => ({ selectedMoveIndex: index })),
  })),
);
