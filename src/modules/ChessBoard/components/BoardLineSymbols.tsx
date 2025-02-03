import React, { FC } from 'react';

interface Props {
  className: string;
  symbols: string[];
}

const BoardLineSymbols: FC<Props> = ({ symbols, className }) => {
  return (
    <ul className={`symbols ${className}`}>
      {symbols.map((symbol) => (
        <li key={symbol}>{symbol}</li>
      ))}
    </ul>
  );
};

export default BoardLineSymbols;
