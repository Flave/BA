import React from 'react';
import { Link } from 'react-router-dom';
import _find from 'lodash/find';
import _max from 'lodash/max';

function getGender(demographics) {
  const femininity = _find(demographics, {trait: "female"});
  return (femininity.value > 0.5) ? "Female" : "Male";
}

function getMostLikelyTrait(properties) {
  return _max(properties, property => property.value)
}

const big5Keys = [
  {
    'key': 'openness',
    'longLabels': ['Conservative and Traditional', 'Liberal and Artistic'],
    'labels': ['Traditional', 'Liberal']
  },
  {
    'key': 'neuroticism',
    'longLabels': ['Laid back and Relaxed', 'Easily Stressed and Emotional'],
    'labels': ['Relaxed', 'Easily Stressed']
  },
  {
    'key': 'agreeableness',
    'longLabels': ['Competitive', 'Team working and Trusting'],
    'labels': ['Competitive', 'Trusting']
  },

  {
    'key': 'extraversion',
    'longLabels': ['Contemplative', 'Engaged with outside world'],
    'labels': ['Contemplative', 'Engaged']
  },
  {
    'key': 'conscientiousness',
    'longLabels': ['Impulsive and Spontaneous', 'Organized and Hard Working'],
    'labels': ['Impulsive', 'Organized']
  }
]

const properties = [
  {
    'key': 'age',
    'label': 'Age'
  },
  {
    'key': 'female',
    'label': 'Psychological Gender'
  },
  {
    'key': 'religion',
    'label': 'Religion'
  },
  {
    'key': 'politics',
    'label': 'Politics'
  }
]

const Predictions = ({ isMe, profile }) => {
  const { predictions } = profile;
  const titlePrefix = isMe ? "Your" : "";
  const person = isMe ? "You" : "This person";
  const gender = getGender(predictions.demographics);
  const politics = getMostLikelyTrait(predictions.politics);
  const religion = getMostLikelyTrait(predictions.religion);
  const age = Math.floor(_find(predictions.demographics, {trait: "age"}).value);

  return (
    <div className="drawer__content">
      <div className="drawer__section">
        <h3>{titlePrefix} Personality Predictions</h3>

        <div className="traits">
          <div className="trait">
            <span className="trait__label">Age</span>
            <span className="trait__value">{age}</span>
          </div>
          <div className="trait">
            <span className="trait__label">Psychological Gender</span>
            <span className="trait__value">{gender}</span>
          </div>
          <div className="trait">
            <span className="trait__label">Religion</span>
            <span className="trait__value">{religion.trait}</span>
          </div>
          <div className="trait">
            <span className="trait__label">Politics</span>
            <span className="trait__value">{politics.trait}</span>
          </div>
        </div>
        <div className="personality">
          <div className="trait__label">Personality</div>
          {
            big5Keys.map(({labels, longLabels, key}) => {
              const big5 = _find(predictions.big5, big => big.trait === key);
              return (
                <div key={key} className="spectrum">
                  <span className="spectrum__label">{labels[0]}: </span>
                  <span className="spectrum__value">{Math.floor(big5.value * 100)}%</span>
                  <span className="spectrum__label">{labels[1]}: </span>
                  <span className="spectrum__value">{100 - Math.floor(big5.value * 100)}%</span>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
};

export default Predictions;