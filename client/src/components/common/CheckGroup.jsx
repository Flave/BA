import React, { Component } from 'react';
import _find from 'lodash/find';

class CheckGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {collapsed: true};
  }

  handleGroupClick({ properties }, activityIndex, event) {
    const options = properties.map((id) => {
      return {
        id,
        value: activityIndex < 2 ? true : false
      }
    });
    this.props.onChange(options);
    event.stopPropagation();
  }

  handleCheckClick(option, event) {
    this.props.onChange([option]);
  }

  createChecks(options, checkedOptions) {
    return options.map((option) => {
      var check = _find(checkedOptions, {id: option.id});
      return this.createCheck(check && check.value, option);
    });
  }

  createCheck(value, option, handleClick) {
    const activeClass = value ? 'is-active' : '';
    const iconClass = value ? 'icon-check' : '';
    return (
      <div 
        key={option.id} 
        className={`check ${activeClass}`}>
        <span 
          onClick={this.handleCheckClick.bind(this, {id: option.id, value: !value})} 
          className="check__box">
          <span className={`check__icon ${iconClass}`}></span>
        </span>
        <span className="check__label">{option.label}</span>
      </div>
    )
  }

  render() {
    const { group, options, values, isOpen } = this.props;
    const { collapsed } = this.state;
    const activeClasses = ['', 'is-semi-active', 'is-active'];
    const activeIcons = ['', 'icon-semi-check', 'icon-check'];
    let activityIndex = 0;
    // get the checked options
    const checkedOptions = values.filter((check) => check.value) || [];
    if(checkedOptions.length) activityIndex = 1;
    if(checkedOptions.length === group.properties.length) activityIndex = 2;
    
    return (
      <div className='check-group'>
        <div 
          onClick={() => this.setState({collapsed: !collapsed})}
          className={`check check--header ${activeClasses[activityIndex]}`}>
          <span 
            onClick={this.handleGroupClick.bind(this, group, activityIndex)}  
            className="check__box">
            <span className={`check__icon ${activeIcons[activityIndex]}`}></span>
          </span>
          <span className="check__label">{group.label}</span>
          <span 
            className={`check__collapse-icon icon-carret-${collapsed ? 'down' : 'up'}`}/>
        </div>

        {!collapsed && this.createChecks(options, checkedOptions)}
      </div>
    )
  }
};

CheckGroup.defaultProps = {
  isOpen: false
}

export default CheckGroup;