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

const scopes = [
  'read:client_grants',
  'create:client_grants',
  'delete:client_grants',
  'update:client_grants',
  'read:clients',
  'update:clients',
  'delete:clients',
  'create:clients',
  'read:client_keys',
  'update:client_keys',
  'delete:client_keys',
  'create:client_keys',
  'read:connections',
  'update:connections',
  'delete:connections',
  'create:connections',
  'read:resource_servers',
  'update:resource_servers',
  'delete:resource_servers',
  'create:resource_servers',
  'read:rules',
  'update:rules',
  'delete:rules',
  'create:rules',
  'read:rules_configs',
  'update:rules_configs',
  'delete:rules_configs',
  'read:email_provider',
  'update:email_provider',
  'delete:email_provider',
  'create:email_provider',
  'read:tenant_settings',
  'update:tenant_settings',
  'read:grants',
  'delete:grants',
  'read:guardian_factors',
  'update:guardian_factors',
  'read:email_templates',
  'create:email_templates',
  'update:email_templates'
];

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
    scopes: scopes.join(' ')
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
