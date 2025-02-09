import Timer from 'modules/Timer';
import { useGameSettingsStore } from 'store/useGameSettings';

export const CheckTimer = () => {
  const timeControls = useGameSettingsStore((state) => state.timeControls);

  if (timeControls) {
    return <Timer timeControls={timeControls} />;
  }

  return <></>;
};
