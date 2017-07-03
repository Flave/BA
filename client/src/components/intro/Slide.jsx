import React from 'react';

const Slide = ({ index, currentIndex, onNext, children }) => {
  let activeClass = "";
  if(index === currentIndex)
    activeClass = "is-active";
  if(index < currentIndex)
    activeClass = "was-active";

  const childrenWithProps = React.Children.map(children,
   (child) => React.cloneElement(child, { onNext })
  );

  return  (
    <div className={`slide ${activeClass}`}>
      {childrenWithProps}
    </div>
  )
}

export default Slide;