import React from 'react';

const Login = () => {
  return  (
    <div className={`slide__content`}>
      <h1 className="slide__title">the internet <br/> of other people</h1>
      <p className="slide__lead">
        The web is bigger than what you see in your browser.  Do you want to know what the <i>internet of someone else</i> looks like?
      </p>
      <div className="slide__login">
        <p className="slide__login-copy">Dive in with &hellip;</p>
        <a className="btn btn--big btn--facebook" href="/auth/facebook"><i className="icon-facebook"></i>Facebook</a>
      </div>
    </div>
  )
}

export default Login;