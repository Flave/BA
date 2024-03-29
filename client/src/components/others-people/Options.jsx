import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as actions from 'app/actions';
import _find from 'lodash/find';
import _compact from 'lodash/compact';
import predictionGroups from 'root/constants/predictionGroups';
import predictionOptions from 'root/constants/predictionOptions';
import predictions from 'root/constants/predictions';
import CheckGroup from 'app/components/common/Check.jsx';
import BubblesLegend from './BubblesLegend.jsx';

import {
  withRouter,
  Route
} from 'react-router-dom';


class Others extends Component {
  handleOptionsChange(group, value) {
    const options = group.properties.map((id) => {
      return { id, value: value }
    });

    this.context.store.dispatch(actions.setOthersPeopleOptions(options));
  }

  createChecks() {
    const { store } = this.context;
    const { ui } = store.getState();

    return (
        <div className="drawer__section">
          <h3 className="drawer__section-title">Select some traits...</h3>
          <div>
            {predictionOptions.map((group, i) => {
              const options = ui.othersPeopleOptions.filter(option => 
                (group.properties.indexOf(option.id) !== -1) && option.value
              )

              return <CheckGroup
                key={group.id}
                option={group}
                value={options.length}
                color={group.color(1) + ""}
                onChange={this.handleOptionsChange.bind(this)}/>
            })}
          </div>
        </div>
    )
  }

  render() {
    const { ui } = this.context.store.getState();

    return (
      <div className="drawer__content">
        <div className="drawer__section">
          <h3 className="drawer__section-title">Machine Predictions</h3>
          <p className="drawer__copy">Use the same mechanisms that are used to create your bubble, to find bubbles that are <b>different</b> from yours. Select or deselect the predictions below to visualise <b>similarities</b></p>
        </div>
        {this.createChecks()}
        <div className="drawer__section drawer__section--full">
          <BubblesLegend predictionsState={ui.othersPeopleOptions} />
        </div>
      </div>
    )
  }
};

Others.contextTypes = {
  store: PropTypes.object
}

export default withRouter(Others);