import React from 'react';
import platforms from 'app/constants/platforms';
import _find from 'lodash/find';


const SourcesDrawer = ({ user }) => {
  const connectedPlatforms = platforms.filter(platform => user.platforms.indexOf(platform.id) !== -1)
  console.log(connectedPlatforms);
  return (
    <div className="drawer__content">
      <div className="drawer__section">
        Platforms
      </div>
    </div>
  )
};

export default SourcesDrawer;