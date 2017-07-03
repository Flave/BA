import React from 'react';

const Step0 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">Other people</h2>
        <p className="onboarding__copy">
          Every bubble here is one person’s internet. Their internet consists of the platforms they spend time on on a daily basis such as Facebook, Twitter, Instagram and Youtube.
        </p>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Continue <span className="icon-long-arrow-forward"/>
        </span>
      </div>
  )
}

export default Step0;