import React from 'react';
import Predictions from './Predictions.jsx';

const Step3 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">Your Bubble</h2>
        <div className="onboarding__copy">
          <p>
            Every bubble represents one person who used this application before. Your bubble is the one in the middle. The closer another bubble is to yours, the more similar this person it to you.
          </p>
        </div>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
        <Predictions />
      </div>
  )
}

export default Step3;