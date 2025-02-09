import Settings from 'modules/SettingsPopup/Settings';
import { useGameSettingsStore } from 'store/useGameSettings';

export const CheckIsSettingsOpened = () => {
  const settingsOpened = useGameSettingsStore((state) => state.settingsOpened);

  if (settingsOpened) {
    return <Settings />;
  }

  return <></>;
};
