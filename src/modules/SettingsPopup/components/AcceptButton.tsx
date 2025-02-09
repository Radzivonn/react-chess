import { FC } from 'react';
import { useGameSettingsStore } from 'store/useGameSettings';
import useStockfishSettingsStore from 'store/useStockfishSettings';

interface Props {
  onApply: () => void;
}

const ApplyButton: FC<Props> = ({ onApply }) => {
  const setSettingsOpened = useGameSettingsStore((state) => state.setSettingsOpened);
  const setSettingsModified = useGameSettingsStore((state) => state.setSettingsModified);
  const setStockfishSettingsModified = useStockfishSettingsStore(
    (state) => state.setStockfishSettingsModified,
  );

  const onClick = () => {
    onApply();
    setSettingsModified(true);
    setStockfishSettingsModified(true);
    setSettingsOpened(false);
  };

  return (
    <button className="button--dark" id="accept-button" onClick={() => onClick()}>
      Apply
    </button>
  );
};

export default ApplyButton;
