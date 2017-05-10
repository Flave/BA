import React, { Component } from 'react';

const Login = ({ user }) => {
  return  (
    <div className="intro__slide">
      <p className="intro__lead">
        The web is bigger than what you see in your browser.  Do you want to know what the <i>internet of someone else</i> looks like?
      </p>
      <div className="login">
        <p className="login__copy">Check it out with &hellip;</p>
        <a className="btn btn--big btn--facebook" href="/auth/facebook"><i className="icon-facebook"></i>Facebook</a>
        {/*<a className="btn btn--twitter " href="/auth/twitter"><i className="icon-twitter"></i>Twitter</a>*/}
      </div>
    </div>
  )
}

export default Login;