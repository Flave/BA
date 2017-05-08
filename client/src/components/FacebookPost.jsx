import React, { Component } from 'react';
import {FacebookProvider, EmbeddedPost} from 'react-facebook';
 
export default class Example extends Component {
  render() {
    return (
      <FacebookProvider appId="1754125368233773">
        <EmbeddedPost href={this.props.url} width="500" />
      </FacebookProvider>
    );
  }
}