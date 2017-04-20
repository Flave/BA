import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Login from '../components/Login.jsx';
import { fetchLogin } from '../api';
import { receiveLogin } from '../actions';


class Intro extends Component {
  componentDidMount() {
    fetchLogin().then((response) => {
      this.context.store.dispatch(receiveLogin(response.data.login));
    });
  }

  render() {
    return <Login {...this.props} />;
  }
}

Intro.contextTypes = {
  store: PropTypes.object
}


const mapStateToProps = (state) => {
  return {
    login: state.login
  }
}

/*const mapDispatchToProps = (dispatch) => {
  receiveUser: 
}*/

/*Intro = connect(
  mapStateToProps,
  null
)(Intro);*/

export default Intro;