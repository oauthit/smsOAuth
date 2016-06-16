/**
 * Main application file
 */

'use strict';

import express from 'express';
import config from './config/environment';
import http from 'http';
import oauth2 from './oauth2';

// Setup server
var app = express();
var server = http.createServer(app);
require('./config/express').default(app);
require('./auth');
require('./routes').default(app);

// Start server
function startServer() {
  app.angularFullstack = server.listen(config.port, config.ip, function() {
    console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
  });
}

setImmediate(startServer);

// Expose app
//noinspection JSUnresolvedVariable
exports = module.exports = app;
