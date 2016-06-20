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
import rp from 'request-promise';
import _ from 'lodash';

const server = oauth2orize.createServer();

export default function (app) {
  // Insert routes below

  app.use('/auth/code', (req, res) => {
    console.log(req.query, req.body);

    return rp.get('http://localhost:9000/api/smsoauth/accesstoken/', {
      params: {
        code: req.query.code
      }
    }).then((body) => {
      body = JSON.parse(body);
      console.log(body);
      return res.json({
        "access_token": body[0].token,
        "token_type": 'access_token',
        "expires_in": 3600
      });
    }).catch((err) => {
      console.log(err);
      return res.sendStatus(500);
    });

  });

  app.get('/userProfile', (req, res) => {

    return res.json({authId: 'someId', name: '845454533'});
  });

  app.get('/loginWithSms/:mobileNumberId', (req, res) => {

      return rp.get('http://localhost:9000/api/smsoauth/accesstoken/' + req.params.mobileNumberId, {
          params: {
            code: req.query.code
          }
        })
        .then((body) => {
          body = _.assign({}, JSON.parse(body), {code: 'hash code' + body.code});
          console.log(body);
          return rp.patch('http://localhost:9000/api/smsoauth/accesstoken/' + req.params.mobileNumberId, body)
            .then((body) => {
              console.log(body);
              return res.json(JSON.parse(body));
            })
            .catch(err => {
              console.log(err);
              return res.sendStatus(500);
            });

        })
        .catch((err) => {
          console.log(err);
          return res.sendStatus(500);
        })
      ;

    }
  );

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
