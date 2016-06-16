/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';
import oauth2orize from 'oauth2orize';
import site from './site';
import oauth2 from './oauth2';
import client from './client';
import user from './user';

const server = oauth2orize.createServer();

export default function(app) {
  // Insert routes below

  app.use('/auth/code', function (req, res) {
    console.log(req.query, req.body);

    return res.json({
      "access_token"  : req.body.code,
      "token_type"    : 'access_token',
      "expires_in"    : 3600
    });
  });

  app.get('/', site.index);
  app.get('/login', site.loginForm);
  app.post('/login', site.login);
  app.get('/logout', site.logout);
  app.get('/account', site.account);

  app.get('/dialog/authorize', oauth2.authorization);
  app.post('/dialog/authorize/decision', oauth2.decision);
  app.post('/oauth/token', oauth2.token);

  app.get('/api/userinfo', user.info);
  app.get('/api/clientinfo', client.info);

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}
