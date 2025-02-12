import React, { ComponentProps, FC } from 'react';

const Dialog: FC<ComponentProps<'div'>> = ({ children }) => {
  return (
    <div className="dialog-bg">
      <div className="dialog">{children}</div>
    </div>
  );
};

export default Dialog;
