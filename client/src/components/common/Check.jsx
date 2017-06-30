import React from 'react';

export default ({ option, value, onChange }) => {
  const activeClass = value ? 'is-active' : '';
  const iconClass = value ? 'icon-check' : '';

  return (
    <div 
      onClick={() => onChange(option, !value)} 
      className={`check ${activeClass}`}>
      <span 
        className="check__box">
        <span className={`check__icon ${iconClass}`}></span>
      </span>
      <span className="check__label">{option.label}</span>
    </div>
  )
};