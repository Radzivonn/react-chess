import { FC } from 'react';

import { ChildrenProps } from 'types/types';

interface Props extends ChildrenProps {
  optionName: string;
  className?: string;
}

const Option: FC<Props> = ({ children, optionName, className }) => {
  return (
    <div className={`settings__option ${className ?? ''}`}>
      <h3 className="option__name">{optionName}</h3>
      {children}
    </div>
  );
};

export default Option;
