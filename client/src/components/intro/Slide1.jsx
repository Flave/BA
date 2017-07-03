import React from 'react';

const Slide1 = ({ onNext }) => {

  return  (
      <div className="slide__content">
        <p className="slide__lead">
          Our experiences on the web are <em className="slide__highlight">highly personalised</em>. Machines decide what we might like or what we might be looking for. It is now easier than ever to block out what we don’t like and only let in what we agree with.
        </p>
        <span onClick={onNext} className="slide__next">Next <span className="icon-long-arrow-forward"/></span>
      </div>
  )
}

export default Slide1;