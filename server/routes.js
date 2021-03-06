/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');
var path = require('path');
var config = require('./config/environment');

module.exports = function (app) {

    // Insert routes below
    app.use('/api/wechat', require('./api/wechat'));
    app.use('/docs/swagger.json', require('./docs'));
    app.use('/api/article', require('./api/article'));
    app.use('/api/things', require('./api/thing'));
    app.use('/api/users', require('./api/user'));

    app.use('/auth', require('./auth'));

    // All undefined asset or api routes should return a 404
    app.route('/:url(api|auth|components|app|bower_components|assets)/*')
        .get(errors[404]);

    // All other routes should redirect to the index.html
    config.env !== 'production' && app.route('/*')
        .get(function (req, res) {
            res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
        });
};
