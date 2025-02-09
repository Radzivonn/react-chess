import React, { FC, useState } from 'react';
import './style.scss';

interface Props {
  currentOption: string;
  options: string[];
  selectOption: (option: string) => void;
}

const Dropdown: FC<Props> = ({ currentOption, options, selectOption }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    selectOption(option);
    setIsOpen(false);
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        {currentOption}
        <span className={`arrow ${isOpen ? 'open' : ''}`} />
      </div>
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li key={index} className="dropdown-item" onClick={() => handleOptionClick(option)}>
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
