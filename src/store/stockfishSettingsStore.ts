import { create } from 'zustand';

interface StockfishSettingsValues {
  engineSkillLevel: number; // Skill level
  moveOverheadValue: number; // Move time
  UCIEloValue: number; // ELO
  depth: number; // Search depth
}

interface StockfishSettingsStore extends StockfishSettingsValues {
  setEngineSkillLevel: (value: number) => void;
  setMoveOverheadValue: (value: number) => void;
  setUCIEloValue: (value: number) => void;
  setDepth: (value: number) => void;
}

interface range {
  min: number;
  max: number;
  default: number;
}

type Ranges = Record<keyof StockfishSettingsValues, range>;

export const settingsValueRanges: Ranges = {
  engineSkillLevel: { min: 0, max: 20, default: 10 },
  moveOverheadValue: { min: 0, max: 5000, default: 100 },
  UCIEloValue: { min: 1320, max: 3190, default: 1320 },
  depth: { min: 1, max: 30, default: 15 },
};

const validateValue = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

const useStockfishSettingsStore = create<StockfishSettingsStore>((set) => ({
  engineSkillLevel: settingsValueRanges.engineSkillLevel.default,
  moveOverheadValue: settingsValueRanges.moveOverheadValue.default,
  UCIEloValue: settingsValueRanges.UCIEloValue.default,
  depth: settingsValueRanges.depth.default,

  setEngineSkillLevel: (value: number) => {
    const { min, max } = settingsValueRanges.engineSkillLevel;
    if (validateValue(value, min, max)) {
      set({ engineSkillLevel: value });
    } else {
      console.error(`engineSkillLevel must be between ${min} and ${max}`);
    }
  },

  setMoveOverheadValue: (value: number) => {
    const { min, max } = settingsValueRanges.moveOverheadValue;
    if (validateValue(value, min, max)) {
      set({ moveOverheadValue: value });
    } else {
      console.error(`moveOverheadValue must be between ${min} and ${max}`);
    }
  },

  setUCIEloValue: (value: number) => {
    const { min, max } = settingsValueRanges.UCIEloValue;
    if (validateValue(value, min, max)) {
      set({ UCIEloValue: value });
    } else {
      console.error(`UCIEloValue must be between ${min} and ${max}`);
    }
  },

  setDepth: (value: number) => {
    const { min, max } = settingsValueRanges.depth;
    if (validateValue(value, min, max)) {
      set({ depth: value });
    } else {
      console.error(`depth must be between ${min} and ${max}`);
    }
  },
}));

export default useStockfishSettingsStore;
