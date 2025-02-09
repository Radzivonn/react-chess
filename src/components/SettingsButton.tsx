import { useGameSettingsStore } from 'store/useGameSettings';

export const SettingsButton = () => {
  const setSettingsOpened = useGameSettingsStore((state) => state.setSettingsOpened);

  return (
    <button className="button--icon" onClick={() => setSettingsOpened(true)}>
      <img width="54" height="54" src="/public/settings.svg" alt="settings" />
    </button>
  );
};
