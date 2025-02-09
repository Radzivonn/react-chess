import { create } from 'zustand';

export const settingsValueRanges = {
  engineSkillLevel: { optionName: 'skill level', min: 0, max: 20, default: 10 },
  moveOverheadValue: { optionName: 'move time', min: 10, max: 5000, default: 100 },
  UCIEloValue: { optionName: 'UCI Elo', min: 1320, max: 3190, default: 1320 },
  depth: { optionName: 'depth', min: 1, max: 30, default: 15 },
  hash: { optionName: 'hash(MB)', min: 4, max: 128, default: 64 },
} as const;

type SettingKey = keyof typeof settingsValueRanges;

interface StateItem<T> {
  key: SettingKey;
  value: T;
  setter: (value: T) => void;
}

export type Items = StateItem<number>[];

interface StockfishSettingsStore {
  stockfishSettingsModified: boolean;
  setStockfishSettingsModified: (modified: boolean) => void;
  items: Items;
  getItem: (key: string) => StateItem<number>;
  setItems: (items: Items) => void;
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
  setItems: (items) => set(() => ({ items })),
}));

export default useStockfishSettingsStore;
