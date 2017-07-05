import React from 'react';
import Predictions from 'app/components/common/Predictions.jsx';

const PredictionsDrawer = ({ isMe, profile }) => {
  return (
    <div className="drawer__content">
      <div className="drawer__title">Predictions</div>
      <div className="drawer__section">
        <Predictions profile={profile} modifiers={["profile"]}/>
      </div>
    </div>
  )
};

export default PredictionsDrawer;