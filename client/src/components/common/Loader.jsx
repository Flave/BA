import React from 'react';

export default ({ copy }) => {
  return (
    <div className="loader">
      <div className="bit-spinner"></div>
      <div className="loader__copy">{copy}</div>
    </div>
  )
}