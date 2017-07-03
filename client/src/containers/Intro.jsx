import React, { Component } from 'react';
import Loader from 'app/components/common/Loader.jsx';
import slides from 'app/components/intro';
import Slide from 'app/components/intro/Slide.jsx';


class Intro extends Component {
  constructor(props) {
    super(props);
    this.state = {
      slideIndex: 0
    }

    this.handleNext = this.handleNext.bind(this);
  }

  handleNext() {
    this.setState({slideIndex: this.state.slideIndex + 1});
  }

  render() {
    const { user } = this.props;
    if(!user)
      return <Loader copy="Loading App" />

    return (
      <div className="intro">
        { slides.map((SlideContent, i) => {
          return (
            <Slide key={i} onNext={this.handleNext} index={i} currentIndex={this.state.slideIndex}>
              <SlideContent />
            </Slide>
          )
        })
        }
      </div>
    )
  }
}

export default Intro;