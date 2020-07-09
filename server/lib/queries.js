import Promise from 'bluebird';
import request from 'superagent';
import { managementApi } from 'auth0-extension-tools';
import config from './config';

const PER_PAGE = 100;

const getToken = (req) => {
  const isAdministrator = req.user && req.user.access_token && req.user.access_token.length;
  if (isAdministrator) {
    return Promise.resolve(req.user.access_token);
  }

  return managementApi.getAccessTokenCached(config('AUTH0_DOMAIN'), config('AUTH0_CLIENT_ID'), config('AUTH0_CLIENT_SECRET'));
};

const makeRequest = (req, path, method, query) =>
  new Promise((resolve) =>
    getToken(req).then(token => {
      request(method, `https://${config('AUTH0_DOMAIN')}/api/v2/${path}`)
        .query(query)
        .set('Content-Type', 'application/json')
        .set('Authorization', `Bearer ${token}`)
        .end((err, res) => {
          if (err) {
            return resolve([ ]);
          }

          return resolve(res.body);
        });
    }));

const requestAll = (req, resource, page, allResults) => {
  page = page || 0;
  allResults = allResults || [];
  return makeRequest(req, resource, 'GET', { page, per_page: PER_PAGE }).then((result) => {
    allResults = allResults.concat(result || []);
    if (result && result.length === PER_PAGE) {
      return requestAll(req, resource, page + 1, allResults);
    } else {
      return allResults;
    }
  });
};

export const getResourceServer = (req, identifier) =>
  requestAll(req, 'resource-servers')
    .then(items => items.find(item => item.identifier === identifier));

export const getClient = (req, clientId) =>
  new Promise((resolve) => req.auth0.clients.get({ client_id: clientId }, (err, client) => {
    if (err) {
      return resolve();
    }
    return resolve(client);
  }));
