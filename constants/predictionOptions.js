const d3InterpolateHsl = require('d3-interpolate').interpolateHsl;


module.exports = [
  {
    id: 'female',
    color: d3InterpolateHsl('#BEC6E9', '#3A63FA'),
    label: 'Psychological Gender',
    unit: '%',
    categories: ['F', 'M'],
    properties: ['female']
  },
  {
    id: 'age',
    color: d3InterpolateHsl('#D3C7E3', '#6F64DB'),
    label: 'Age',
    unit: 'y',
    properties: ['age']
  },
  {
    id: 'intelligence',
    color: d3InterpolateHsl('#DBBACD', '#A364BC'),
    label: 'Intelligence',
    unit: '%',
    properties: ['intelligence']
  },
  {
    id: 'satisfaction_life',
    color: d3InterpolateHsl('#E5C3D0', '#EC6591'),
    label: 'Life satisfaction',
    unit: '%',
    properties: ['satisfaction_life']
  },
  {
    id: 'politics',
    color: d3InterpolateHsl('#F1D3D9', '#FF7B8A'),
    label: 'Political Orientation',
    unit: '%',
    properties: [
      'politics_liberal',
      'politics_conservative',
      'politics_libertanian',
      'politics_uninvolved'
    ]
  },
  {
    id: 'religion',
    color: d3InterpolateHsl('#F9E0E0', '#FE9B91'),
    label: 'Religious Orientation',
    unit: '%',
    properties: [
      'religion_catholic',
      'religion_lutheran',
      'religion_jewish',
      'religion_mormon',
      'religion_none',
      'religion_christian_other'
    ]
  },
  {
    id: 'big5',
    color: d3InterpolateHsl('#F9E7E4', '#FEC89A'),
    label: 'Personality',
    unit: '%',
    properties: [
      'big5_agreeableness',
      'big5_openness',
      'big5_conscientiousness',
      'big5_neuroticism',
      'big5_extraversion'
    ]
  }
]

// Pink turkis yellow
// #FDB0FF
// #BEBFE8
// #81CFD4
// #44DEBF
// #80DFA8
// #FADC84
// #C3DD94



// Blue orange red

// #3A63FA
// #7685DC
// #B6A5BE
// #FEC59A
// #FFB296
// #FF888D
// #FF6786


// Blue red Orange
// #3A63FA
// #6F64DB
// #A364BC
// #EC6591
// #FF7B8A
// #FE9B91
// #FEC89A



//Orange red blue
// #FEC89A
// #FE9B91
// #FF7B8A
// #EC6591
// #A364BC
// #6F64DB
// #3A63FA



// Dark Blue, wine red, turkis

// #133758
// #523E69
// #9B3C7C
// #D14E8E
// #DB7FB8
// #BCB6DA
// #89F1E4

// Dark purple, red, yellow
// #504E7Bs
// #996D87
// #D48590
// #FC9596
// #FFAF9B
// #FECAA0
// #FDE8A5


// Pink yellow blue -> redo
// #FD8DF9
// #FFA0C4
// #FFBD92
// #FFCB7B
// #8FCFF6
// #8F87E3
// #3967FB

// Pink yellow blue
// #F691F2
// #FFAECC
// #FEC39D
// #FECE86
// #B6D1E2
// #9497C2
// #3967FB

// Redish sunset sky
// #404A73
// #5F4682
// #A95686
// #CC658C
// #ED7890
// #FB9B9B
// #F7BCB3