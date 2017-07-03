import React from 'react';

const Step1 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">You</h2>
        <p className="onboarding__copy">
          Your bubble is the one in the middle. The closer other bubbles are, the more similar the person it to you.
        </p>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
      </div>
  )
}

export default Step1;