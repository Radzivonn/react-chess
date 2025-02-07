import { create } from 'zustand';

export const settingsValueRanges = {
  engineSkillLevel: { min: 0, max: 20, default: 10 },
  moveOverheadValue: { min: 1, max: 5000, default: 100 },
  UCIEloValue: { min: 1320, max: 3190, default: 1320 },
  depth: { min: 1, max: 30, default: 15 },
  hash: { min: 4, max: 128, default: 64 },
} as const;

type SettingKey = keyof typeof settingsValueRanges;

interface StateItem<T> {
  key: SettingKey;
  value: T;
  setter: (value: T) => void;
}

interface StockfishSettingsStore {
  stockfishSettingsModified: boolean;
  setStockfishSettingsModified: (modified: boolean) => void;
  items: StateItem<number>[];
  getItem: (key: string) => StateItem<number>;
}

const useStockfishSettingsStore = create<StockfishSettingsStore>((set, get) => ({
  stockfishSettingsModified: false,
  setStockfishSettingsModified: (stockfishSettingsModified) =>
    set(() => ({ stockfishSettingsModified })),
  items: Object.entries(settingsValueRanges).map(([key, value]) => ({
    key: key as SettingKey,
    value: value.default,
    setter: (newValue: number) => {
      set((state: StockfishSettingsStore) => ({
        items: state.items.map((item: StateItem<number>) =>
          item.key === key ? { ...item, value: newValue } : item,
        ),
      }));
    },
  })),
  getItem: (key) => {
    const item = get().items.find((item) => item.key === key);
    if (item) return item;
    throw new Error(`Item by ${key} key was not found`);
  },
}));

export default useStockfishSettingsStore;
