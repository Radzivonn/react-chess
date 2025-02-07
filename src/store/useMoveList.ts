import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import { MoveList } from 'types/types';

interface MoveListStore {
  moveList: MoveList;
  selectedMoveIndex: number; // selected move from the move table
  setMoveList: (moveList: MoveList) => void;
  setSelectedMoveIndex: (index: number) => void;
}

export const useMoveListStore = create<MoveListStore>()(
  devtools((set) => ({
    moveList: [],
    selectedMoveIndex: 0,
    setMoveList: (moveList) => set(() => ({ moveList })),
    setSelectedMoveIndex: (index) => set(() => ({ selectedMoveIndex: index })),
  })),
);
