import React from 'react';
export default ({ more, onClick }) => {
    if(more)
    return <div
          className="btn btn--raised btn--load-more" 
          onClick={onClick}>Load More</div>

    return <div className="btn btn--raised btn--load-more btn--disabled">Nothing left to load</div>
}