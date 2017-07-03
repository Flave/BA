import React from 'react';
import Predictions from './Predictions.jsx';

const Step3 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">Machine Predictions</h2>
        <p className="onboarding__copy">
          In order to show you similarities I used a machine based prediction of your which is based on your Facebook likes. Similar predictions are made of you by Facebook, Google & co. to determine what content they should show you and what to hide.
        </p>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
        <Predictions />
      </div>
  )
}

export default Step3;