import React, { Component } from 'react';
import _find from 'lodash/find';

class Others extends Component {
  handleGroupClick({ properties }, activityIndex) {
    const options = properties.map((id) => {
      return {
        id,
        value: activityIndex < 2 ? true : false
      }
    });
    this.props.onChange(options);
  }

  handleTickClick(option) {
    this.props.onChange([option]);
  }
    
  createTicks(options, checkedOptions) {
    return options.map((option) => {
      var tick = _find(checkedOptions, {id: option.id});
      return this.createTick(tick && tick.value, option);
    });
  }

  createTick(value, option, handleClick) {
    const activeClass = value ? 'is-active' : '';
    return (
      <div 
        key={option.id} 
        onClick={this.handleTickClick.bind(this, {id: option.id, value: !value})} 
        className={`tick ${activeClass}`}>
        <span className="tick__box"></span>
        <span className="tick__label">{option.label}</span>
      </div>
    )
  }

  render() {
    const { group, options, values } = this.props;
    const activeClasses = ['', 'is-semi-active', 'is-active'];
    let activityIndex = 0;
    // get the checked options
    const checkedOptions = values.filter((tick) => tick.value) || [];
    if(checkedOptions.length) activityIndex = 1;
    if(checkedOptions.length === group.properties.length) activityIndex = 2;
    
    return (
      <div className='tick-group'>
        <div 
          onClick={this.handleGroupClick.bind(this, group, activityIndex)} 
          className={`tick tick--header ${activeClasses[activityIndex]}`}>
          <span className="tick__box"></span>
          <span className="tick__label">{group.label}</span>
        </div>

        {this.createTicks(options, checkedOptions)}
      </div>
    )
  }
};

export default Others;