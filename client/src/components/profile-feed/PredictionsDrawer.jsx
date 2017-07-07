import React from 'react';
import Predictions from 'app/components/common/Predictions.jsx';

const PredictionsDrawer = ({ isMe, profile }) => {
  return (
    <div className="drawer__content">
      <div className="drawer__title">Machine Predictions</div>
      <div className="drawer__section">
        These are the personality predictions <a href="https://applymagicsauce.com/" target="_blank">a computer</a> made about {isMe ? "you" : "this person" }. Similar predictions are made by Facebook & co. to decide what to show you and what to hide.
      </div>
      <div className="drawer__section">
        <Predictions profile={profile} modifiers={["profile"]}/>
      </div>
    </div>
  )
};

export default PredictionsDrawer;