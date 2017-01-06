import jwt from 'express-jwt';
import jwksRsa from 'jwks-rsa';
import { UnauthorizedError } from 'auth0-extension-tools';

export default (domain, audience, secret, isSecretEncoded) => {
  if (secret && secret.length) {
    return jwt({
      secret: isSecretEncoded ? new Buffer(secret, 'base64') : secret,

      // Validate the audience and the issuer.
      audience,
      issuer: `https://${domain}/`,
      algorithms: [ 'HS256' ],

      // Optionally require authentication
      credentialsRequired: true,

      // Get the token from the body, this is not a bearer token.
      getToken: (req) => req.body && req.body.token
    });
  }

  return jwt({
    secret: jwksRsa.expressJwtSecret({
      cache: true,
      rateLimit: true,
      jwksRequestsPerMinute: 5,
      jwksUri: `https://${domain}/.well-known/jwks.json`,
      handleSigningKeyError(err, cb) {
        if (err instanceof jwksRsa.SigningKeyNotFoundError) {
          return cb(new UnauthorizedError('A token was provided with an invalid kid'));
        }

        return cb(err);
      }
    }),

    // Validate the audience and the issuer.
    audience,
    issuer: `https://${domain}/`,
    algorithms: [ 'RS256' ],

    // Optionally require authentication
    credentialsRequired: true,

    // Get the token from the body, this is not a bearer token.
    getToken: (req) => req.body && req.body.token
  });
};
