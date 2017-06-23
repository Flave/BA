import React from 'react';

export default ({ userLoading, usersLoading, profileLoading, feedLoading}) => {
  if(userLoading)
    return <div className="loader">Loading Application</div>
  if(usersLoading)
    return <div className="loader">Loading Bubbles</div>
  if(profileLoading)
    return <div className="loader">Loading the Bubble</div>
  if(feedLoading)
    return <div className="loader">Loading the Feed</div>
  return <div/>
}