import axios from 'axios';
import jwtDecode from 'jwt-decode';

import * as constants from '../constants';

function isExpired(decodedToken) {
  if (typeof decodedToken.exp === 'undefined') {
    return true;
  }

  const d = new Date(0);
  d.setUTCSeconds(decodedToken.exp);

  return !(d.valueOf() > (new Date().valueOf() + (1000)));
}

export function logout() {
  return (dispatch) => {
    sessionStorage.removeItem('deploy-cli:apiToken');

    window.location.href = window.config.AUTH0_MANAGE_URL;

    dispatch({
      type: constants.LOGOUT_SUCCESS
    });
  };
}

export function loadCredentials() {
  return (dispatch) => {
    const token = sessionStorage.getItem('deploy-cli:apiToken');
    if (token) {
      const apiToken = token;
      if (apiToken) {
        const decodedToken = jwtDecode(apiToken);
        if (isExpired(decodedToken)) {
          return;
        }

        axios.defaults.headers.common.Authorization = `Bearer ${apiToken}`;

        dispatch({
          type: constants.LOADED_TOKEN,
          payload: {
            token: apiToken
          }
        });

        dispatch({
          type: constants.LOGIN_SUCCESS,
          payload: {
            token: apiToken,
            decodedToken,
            user: decodedToken
          }
        });
      }
    }
  };
}
