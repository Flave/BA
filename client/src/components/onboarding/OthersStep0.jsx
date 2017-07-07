import React from 'react';

const Step0 = ({ onNext }) => {

  return  (
      <div className="onboarding__content">
        <h2 className="onboarding__title">The Personalised Internet</h2>
        <div className="onboarding__copy">
          <p>
            The Social Platforms you use create computer predictions about who you are and what you might like.
          </p>
          <p>
            Ultimately they play a big role in what has to become known as The Filter Bubble — filter mechanisms that only show you things that falls into your interests and reflect your oppinion.
          </p>
        </div>
        <span onClick={onNext} className="btn btn--cta onboarding__next">
          Let's turn the tables <span className="icon-long-arrow-forward"/>
        </span>
      </div>
  )
}

export default Step0;