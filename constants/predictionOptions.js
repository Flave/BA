const d3InterpolateHsl = require('d3-interpolate').interpolateHsl;


module.exports = [
  {
    'id': 'female',
    'col': d3InterpolateHsl('#BEC6E9', '#404A73'),
    label: 'Psychological Gender',
    'unit': '%',
    properties: ['female']
  },
  {
    'id': 'age',
    'col': d3InterpolateHsl('#D3C7E3', '#5F4682'),
    label: 'Age',
    'unit': 'y',
    properties: ['age']
  },
  {
    'id': 'intelligence',
    'col': d3InterpolateHsl('#DBBACD', '#A95686'),
    label: 'Intelligence',
    'unit': '%',
    properties: ['intelligence']
  },
  {
    'id': 'satisfaction_life',
    'col': d3InterpolateHsl('#E5C3D0', '#CC658C'),
    label: 'Life satisfaction',
    'unit': '%',
    properties: ['satisfaction_life']
  },
  {
    'id': 'politics',
    'col': d3InterpolateHsl('#F1D3D9', '#ED7890'),
    'label': 'Political Orientation',
    'unit': '%',
    'properties': [
      'politics_liberal',
      'politics_conservative',
      'politics_libertanian',
      'politics_uninvolved'
    ]
  },
  {
    'id': 'religion',
    'col': d3InterpolateHsl('#F9E0E0', '#FB9B9B'),
    'label': 'Religious Orientation',
    'unit': '%',
    'properties': [
      'religion_catholic',
      'religion_lutheran',
      'religion_jewish',
      'religion_mormon',
      'religion_none',
      'religion_christian_other'
    ]
  },
  {
    'id': 'big5',
    'col': d3InterpolateHsl('#F9E7E4', '#F7BCB3'),
    'label': 'Personality',
    'unit': '%',
    'properties': [
      'big5_agreeableness',
      'big5_openness',
      'big5_conscientiousness',
      'big5_neuroticism',
      'big5_extraversion'
    ]
  }
]