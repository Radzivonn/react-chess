import { useMemo, useRef, useState } from 'react';
import OptionBlock from './components/OptionBlock';
import ApplyButton from './components/AcceptButton';
import './style.scss';
import { useClickOutside } from 'hooks/useClickOutside/useClickOutside';
import { useGameSettingsStore } from 'store/useGameSettings';
import useStockfishSettingsStore from 'store/useStockfishSettings';

const Settings = () => {
  const settingsRef = useRef(null);
  const { timeControls, setTimeControls, setSettingsOpened } = useGameSettingsStore();
  const { items, setItems } = useStockfishSettingsStore();
  const [draftTimeControls, setDraftTimeControls] = useState(timeControls);

  /* need to implement settings rollback in case of exiting the settings without applying them. */
  const memoizedItems = useMemo(() => items, []);

  /* 
    if a click occurs outside the popup, 
    the popup is closed and all changed settings return to the original ones 
    that were when the settings were opened. 
  */
  const onClickOutside = () => {
    setItems(memoizedItems);
    setSettingsOpened(false);
  };

  useClickOutside(settingsRef, () => onClickOutside());

  return (
    <div className="settings-popup-bg">
      <div className="settings-popup" ref={settingsRef}>
        <OptionBlock timeControls={draftTimeControls} onSelectTimeControls={setDraftTimeControls} />
        <ApplyButton onApply={() => setTimeControls(draftTimeControls)} />
      </div>
    </div>
  );
};

export default Settings;
