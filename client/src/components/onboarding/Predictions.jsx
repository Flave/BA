import React, { Component } from 'react';
import predictionOptions from 'root/constants/predictionOptions';
import predictions from 'root/constants/predictions';
import _find from 'lodash/find';

class Predictions extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expandedGroups: []
    }
  }

  handleCollapseToggle(group) {
    const index = this.state.expandedGroups.indexOf(group.id);
    if(index === -1) {
      this.setState({expandedGroups: [...this.state.expandedGroups, group.id]});
    } else {
      this.state.expandedGroups.splice(index, 1);
      this.setState({expandedGroups: this.state.expandedGroups});
    }
  }

  render() {
    return  (
      <div className="onboarding__predictions">
        {predictionOptions.map(group => {
          const isExpanded = this.state.expandedGroups.indexOf(group.id) !== -1;
          const hasProperties = group.properties.length > 1;

          return (
            <div className={`onboarding__group ${hasProperties && "onboarding__group--expandable"}`} key={group.id}>
              <div onClick={this.handleCollapseToggle.bind(this, group)} className="onboarding__group-name">
                <span style={{background: group.color(1)}} className="onboarding__group-color"/>
                {group.label}
                {hasProperties && <span className={`onboarding__group-icon icon-carret-${isExpanded ? "up" : "down"}`}/>}
              </div>
              {isExpanded && hasProperties && group.properties.map(id => {
                const property = _find(predictions, {id: id});
                return <div className="onboarding__prediction" key={property.id}>{property.label}</div>
              })}
            </div>
          )
        })}
      </div>
    )
  }
}

export default Predictions;