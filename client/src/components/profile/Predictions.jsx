import React from 'react';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';
import _max from 'lodash/max';

function getGender(demographics) {
  const femininity = _find(demographics, {trait: "Female"});
  return (femininity > 0.5) ? "Female" : "Male";
}

function getMostLikelyTrait(properties) {

}

const Predictions = ({ isMe, profile }) => {
  const { predictions } = profile;
  const titlePrefix = isMe ? "Your" : "";
  const person = isMe ? "You" : "This person";
  const age = _find(predictions.demographics, {trait: "Age"});
  const gender = getGender(predictions.demographics);
  const getMostLikelyTrait = getMostLikelyTrait(predictions.politics);
  //const age = _find(predictions.demographics, {trait: "Age"});

  return (
    <div className="predictions">
      <h3>{titlePrefix} Personality Predictions</h3>
      <p>You seem to be around the age of 28 and Female. You seem to have rather liberal political view and are slightly catholic.</p>
    </div>
  )
};

export default Predictions;