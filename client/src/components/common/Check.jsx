import React from 'react';

export default ({ option, value, color, onChange }) => {
  const activeClass = value ? 'is-active' : '';
  const iconClass = value ? 'icon-check' : '';
  const style = value ? {borderColor: color, backgroundColor: color} : {borderColor: color};

  return (
    <div 
      onClick={() => onChange(option, !value)} 
      className={`check ${activeClass}`}>
      <span 
        style={style}
        className="check__box">
        <span className={`check__icon ${iconClass}`}></span>
      </span>
      <span className="check__label">{option.label}</span>
    </div>
  )
};