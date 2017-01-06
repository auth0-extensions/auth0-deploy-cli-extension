import path from 'path';
import morgan from 'morgan';
import Express from 'express';
import bodyParser from 'body-parser';
import { middlewares, routes } from 'auth0-extension-express-tools';

import logger from './lib/logger';
import config from './lib/config';
import api from './routes/api';
import meta from './routes/meta';
import hooks from './routes/hooks';
import htmlRoute from './routes/html';

module.exports = (configProvider) => {
  config.setProvider(configProvider);

  const app = new Express();
  app.use(morgan(':method :url :status :response-time ms - :res[content-length]', {
    stream: logger.stream
  }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  // Configure routes.
  app.use(routes.dashboardAdmins({
    stateKey: 'deploy-cli-state',
    secret: config('EXTENSION_SECRET'),
    audience: 'urn:deploy-cli',
    rta: config('AUTH0_RTA').replace('https://', ''),
    domain: config('AUTH0_DOMAIN'),
    baseUrl: config('PUBLIC_WT_URL'),
    clientName: 'Deploy CLI Extension',
    urlPrefix: '/admins',
    sessionStorageKey: 'deploy-cli:apiToken',
    scopes: 'read:tenant_settings update:tenant_settings' +
    ' create:client_grants read:client_grants update:client_grants delete:client_grants' +
    ' create:clients read:clients update:clients delete:clients' +
    ' read:connections update:connections' +
    ' create:resource_servers read:resource_servers update:resource_servers delete:resource_servers' +
    ' read:rules create:rules update:rules delete:rules'
  }));

  // Configure routes.
  app.use('/api', api());
  app.use('/app', Express.static(path.join(__dirname, '../dist')));
  app.use('/meta', meta());
  app.use('/.extensions', hooks());

  // Fallback to rendering HTML.
  app.get('*', htmlRoute());

  // Generic error handler.
  app.use(middlewares.errorHandler(logger.error));
  return app;
};
