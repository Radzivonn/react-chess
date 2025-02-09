import Option from './Option';
import Dropdown from 'components/Dropdown/Dropdown';
import Range from 'components/Range/Range';
import useStockfishSettingsStore, { settingsValueRanges } from 'store/useStockfishSettings';
import timeOptions from '../constants/timeOptions';
import { getTimeFromOption } from '../helpers/getTimeFromTimeOption';
import { FC } from 'react';

interface Props {
  timeControls: number | null;
  onSelectTimeControls: (timeControls: number | null) => void;
}

const OptionBlock: FC<Props> = ({ timeControls, onSelectTimeControls }) => {
  const items = useStockfishSettingsStore((state) => state.items);

  const currentTimeOption = timeControls
    ? timeOptions.find((option) => getTimeFromOption(option) === timeControls)
    : timeOptions[0];

  return (
    <div className="settings__option-list">
      <Option optionName="Time controls" className="gap-4">
        <Dropdown
          currentOption={currentTimeOption!} // !
          options={timeOptions}
          selectOption={(option) => onSelectTimeControls(getTimeFromOption(option))}
        />
      </Option>
      <Option optionName="Stockfish settings" className="gap-4">
        {items.map((option) => (
          <Range
            name={settingsValueRanges[option.key].optionName}
            key={option.key}
            min={settingsValueRanges[option.key].min}
            max={settingsValueRanges[option.key].max}
            defaultValue={option.value}
            setOption={option.setter}
          />
        ))}
      </Option>
    </div>
  );
};

export default OptionBlock;
