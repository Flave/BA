import React from 'react';
import Predictions from './Predictions.jsx';

const Step1 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">Machine Predictions</h2>
        <div className="onboarding__copy">
          <p>
            These kinds of models and machine predictions have to be treated with caution. They are statistical probabilities that are calculated based on our interactions with these platforms such as things we click on or things we like. 
          </p>
          <p>
            They are often based on our unconscious bahviour which doesn't always reflect our own best interest.
          </p>
        </div>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
        <Predictions />
      </div>
  )
}

export default Step1;