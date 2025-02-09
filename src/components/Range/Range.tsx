import React, { FC, useState } from 'react';
import './style.scss';

interface Props {
  name: string;
  min: number;
  max: number;
  defaultValue: number;
  setOption: (value: number) => void;
}

const Range: FC<Props> = ({ name, min, max, defaultValue, setOption }) => {
  const [currentValue, setCurrentValue] = useState(defaultValue);

  const onChange = (value: string) => {
    const numberValue = Number(value);
    if (!isNaN(numberValue)) {
      setOption(numberValue);
      setCurrentValue(numberValue);
    }
  };

  return (
    <div className="range-container">
      <label className="range__name"> {name} </label>
      <input
        type="range"
        min={min}
        max={max}
        value={currentValue}
        onChange={(e) => onChange(e.target.value)}
        className="custom-range"
      />
      <span className="range__value">{currentValue}</span>
    </div>
  );
};

export default Range;
