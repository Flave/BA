import React from 'react';
import Predictions from './Predictions.jsx';

const Step2 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">Turning the tables</h2>
        <div className="onboarding__copy">
          <p>
            I used a service to create similar predictions about you and everyone else based on the pages they liked on Facebook. You can use these predictions to find other people and to peek into their bubbles.
          </p>
          <p>
            Every prediction includes the following charater traits:
          </p>
        </div>
        <Predictions />
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
      </div>
  )
}

export default Step2;