import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface GameSettingsStore {
  settingsOpened: boolean;
  settingsModified: boolean;
  timeControls: number | null; // Time Controls of game in seconds, null - game without time controls
  setSettingsOpened: (settingsOpened: boolean) => void;
  setSettingsModified: (modified: boolean) => void;
  setTimeControls: (timeControls: number | null) => void;
}

export const useGameSettingsStore = create<GameSettingsStore>()(
  devtools((set) => ({
    settingsOpened: false,
    settingsModified: false,
    timeControls: null,
    setSettingsOpened: (settingsOpened) => set(() => ({ settingsOpened })),
    setSettingsModified: (settingsModified) => set(() => ({ settingsModified })),
    setTimeControls: (timeControls) => set(() => ({ timeControls })),
  })),
);
