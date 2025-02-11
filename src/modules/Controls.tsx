import { SettingsButton } from 'components/SettingsButton';
import { RestartButton } from 'components/RestartButton/RestartButton';

const Controls = () => {
  return (
    <div className="controls">
      <SettingsButton />
      <RestartButton />
    </div>
  );
};

export default Controls;
