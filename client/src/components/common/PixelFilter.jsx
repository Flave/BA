import React from 'react';

export default (props) => (
  <svg>
    <filter id="pixelate" x="0" y="0">
    <feFlood x="4" y="4" height="2" width="2"/>    
    <feComposite width="6" height="6"/>
    <feTile result="a"/>
    <feComposite in="SourceGraphic" in2="a" operator="in"/>
    <feMorphology operator="dilate" radius="2"/>
    </filter>
    </svg>
)