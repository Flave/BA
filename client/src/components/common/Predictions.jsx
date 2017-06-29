import React, { Component } from 'react';
import { predictionGroups, predictions } from 'root/constants';
import _find from 'lodash/find';

class BubbleTooltip extends Component {
  constructor(props) {
    super(props);
    this.createPredictionGroup = this.createPredictionGroup.bind(this);
  }

  createPredictionGroup(group) {
    const { profile, predictionsSelection } = this.props;

    return (
      <div className="prediction__group" key={group.id}>
        <div className="prediction__group-label">{group.label}</div>
        {group.properties.map(prediction => {
          let predictionSpec = _find(predictions, {id: prediction});
          let profilePrediction = _find(profile.predictions, {id: prediction});
          let value = prediction === "age" ? profilePrediction.value : profilePrediction.value * 100;
          let formattedValue = value.toString().slice(0, 2);
          let unit = prediction === "age" ? "y" : "%";
          let inactiveClass = "";

          if(predictionsSelection) {
            let isSelected = _find(predictionsSelection, {id: prediction}).value;
            inactiveClass = isSelected ? '' : 'is-inactive';
          }

          return (
            <div className={`prediction ${inactiveClass}`} key={prediction}>
              <span className="prediction__label">{predictionSpec.label} </span>
              <span className="prediction__value">{formattedValue}{unit}</span>
              <div className="prediction__bar">
                <div style={{width: `${value}%`}} className="prediction__bar-value" />
              </div>
            </div>
          )
          
        })}
      </div>
    )
  }

  render() {
    const groups = predictionGroups.map(this.createPredictionGroup);
    const modifiers = this.props.modifiers.map(modifier => `predictions--${modifier}`).join(" ");

    return (
      <div className={`predictions ${modifiers}`}>
        {groups}
      </div>
    )
  }
}

export default BubbleTooltip;