import React, { Component } from 'react';
import PropTypes from 'prop-types';
import steps from './index';
import * as actions from 'app/actions';

class Onboarding extends Component {
  constructor(props) {
    super(props);
    this.handleNext = this.handleNext.bind(this);
  }
  handleNext() {
    if(this.props.currentStep < steps.length - 1)
      this.context.store.dispatch(actions.nextOnboarding());
    else
      this.context.store.dispatch(actions.updateUser({returning: true}));
  }

  render() {
    const { currentStep } = this.props;
    return  (
      <div className={`onboarding`}>
        {steps.map((Step, i) => {
          let activeClass = "";
          if(i === currentStep)
            activeClass = "is-active";
          if(i < currentStep)
            activeClass = "was-active";

          return (
            <div key={i} className={`onboarding__step ${activeClass}`}>
              <Step onNext={this.handleNext} activeClass={activeClass} />
            </div> 
          )
        })}
      </div>
    )
  }
}

Onboarding.contextTypes = {
  store: PropTypes.object
}

export default Onboarding;