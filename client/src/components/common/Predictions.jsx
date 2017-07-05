import React, { Component } from 'react';
import { predictionOptions, predictions } from 'root/constants';
import LineChart from './LineChart.jsx';
import StackedLineChart from './StackedLineChart.jsx';
import _find from 'lodash/find';
import { hsl as d3Hsl } from 'd3-color';

const groups = [
  ['female', 'age', 'intelligence', 'satisfaction_life'],
  ['politics', 'religion'],
  ['big5']
]

class Predictions extends Component {
  constructor(props) {
    super(props);
  }

  getValueString(value) {
    return Math.round(value * 100).toString().split('.')[0];
  }

  createLineChart(prediction, predictionSpec, group, modifier) {
    const value = predictionSpec.unit !== "%" ? prediction.value / 100 : prediction.value;
    let valueString = this.getValueString(value) + predictionSpec.unit;
    const { categories } = predictionSpec;

    if(categories)
      valueString += ` ${categories[0]} / ${this.getValueString(1 - value)}${predictionSpec.unit} ${categories[1]}`

    return (
      <div key={prediction.id} className={`chart chart--${modifier}`}>
        <div className="chart__header">
          <div className="chart__value chart__value--right">{valueString}</div>
          <div className="chart__label">{predictionSpec.label}</div>
        </div>
        <div className="chart__range-bar">
          <div 
            style={{width: `${value * 100}%`, background: group.color(1)}} 
            className="chart__value-bar"/>
        </div>
      </div>
    )
  }

  createSplitChart(prediction, {categories, unit}, group) {
    const valueStrings = categories.map((category, i) => 
      `${this.getValueString(Math.abs(i - prediction.value))}${unit} ${category}`
    )
    return (
      <div key={prediction.id} className="chart">
        <div className="chart__header">
          <div className="chart__label">{group.label}</div>
        </div>
        <div className="chart__range-bar">
        {categories.map((category, i) => {
          const value = Math.abs(i - prediction.value);
          const color = d3Hsl(group.color(1));
          color.opacity = 1 - i / 2;
          const style = {
            background: color + "",
            width: value * 100 + "%"
          }

          return (
            <span key={category} style={style} className="chart__value-bar"/>
          )
        })}
        </div>
        <div className="chart__footer">
          <div className="chart__value chart__value--right">{valueStrings[1]}</div>
          <div className="chart__value chart__value--left">{valueStrings[0]}</div>
        </div>
      </div>
    )   
  }

  createStackedChart(predictions, predictionSpecs, group) {
    predictions.sort((a, b) => b.value - a.value);
    const topSpec = _find(predictionSpecs, {id: predictions[0].id});
    const topValueString = this.getValueString(predictions[0].value) + topSpec.unit;

    return (
      <div className="chart">
        <div className="chart__header">
          <div className="chart__label">{group.label}</div>
        </div>
        <div className="chart__range-bar">
          {predictions.map((prediction, i) => {
            const spec = _find(predictionSpecs, {id: prediction.id});
            const valueString = this.getValueString(prediction.value) + spec.unit;
            const color = d3Hsl(group.color(1));
            color.opacity = 1 - i / predictionSpecs.length;
            const style = {
              background: color + "",
              width: prediction.value * 100 + "%"
            }

            return (
              <span key={spec.id} style={style} className="chart__value-bar"/>
            )
          })}
        </div>
        <div className="chart__footer">
          <div className="chart__value">{topValueString} {topSpec.label}</div>
        </div>
      </div>
    )
  }


  createLinechartChartGroup(predictions, predictionSpecs, group) {
    return (
      <div className="chart-group">
        <div className="chart-group__label">{group.label}</div> 
        {predictionSpecs.map(spec => {
          const prediction = _find(predictions, {id: spec.id});
          return this.createLineChart(prediction, spec, group, 'minor');
        })}
      </div>
    )
  }

  render() {
    const { profile, selection } = this.props;
    const modifiers = this.props.modifiers.map(modifier => `predictions--${modifier}`).join(" ");


    return (
      <div className={`predictions ${modifiers}`}>
        {groups.map((group, i) => {
          let selectedGroups = group;
          if(selection)
            selectedGroups = group.filter(groupId => {
              const optionGroup = _find(predictionOptions, {id: groupId});
              return _find(selection, {id: optionGroup.properties[0]}).value;
            });

          if(!selectedGroups.length) return;

          return (
            <div key={i} className="predictions__group">
              {selectedGroups.map(groupId => {
                const optionGroup = _find(predictionOptions, {id: groupId});
                const profilePredictions = profile.predictions.filter(p => optionGroup.properties.indexOf(p.id) !== -1);
                const predictionSpecs = predictions.filter(p => optionGroup.properties.indexOf(p.id) !== -1);

                return (
                  <div key={groupId} className="predictions__option-group">
                    {groupId === 'female' && this.createSplitChart(profilePredictions[0], predictionSpecs[0], optionGroup)}
                    {(optionGroup.properties.length <= 1) && (groupId !== "female") && this.createLineChart(profilePredictions[0], predictionSpecs[0], optionGroup)}
                    {(groupId === "politics" || groupId === "religion") && this.createStackedChart(profilePredictions, predictionSpecs, optionGroup)}
                    {(groupId === "big5") && this.createLinechartChartGroup(profilePredictions, predictionSpecs, optionGroup)}
                  </div>
                )
              })}    
            </div>
          )
        })}
      </div>
    )
  }
}

export default Predictions;