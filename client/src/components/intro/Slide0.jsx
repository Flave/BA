import React from 'react';

const Slide0 = ({ onNext }) => {

  return  (
      <div className="slide__content">
        <p className="slide__lead">
          “It will be very hard for people to watch or consume something that has not in some sense been tailored for them”
        </p>
        <p className="slide__meta">— Eric Schmidt (CEO Google) 2010</p>
        <span onClick={onNext} className="slide__next">Next <span className="icon-long-arrow-forward"/></span>
      </div>
  )
}

export default Slide0;