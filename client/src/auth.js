import axios from 'axios';

const Auth = {
  authenticateUser: function(cb) {
    
/*    if(!this.isUserAuthenticated()) {
      axios.get('/api/user')
        .then((response) => {
          if(response.data.user !== null) {
            localStorage.setItem('token', response.data.user._id);
            cb(true);
          } else {
            cb(false);
          }
        });
    } else {
      cb(true);
    }*/
  },

  isUserAuthenticated: () => {
    return localStorage.getItem('token') !== null;
  },

  deauthenticateUser: () => {
    localStorage.removeItem('token');
  },

  getToken: () => {
    return localStorage.getItem('token');
  }
}

export default Auth;