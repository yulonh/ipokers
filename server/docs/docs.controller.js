'use strict';

var _ = require('lodash');
var swaggerJSDoc = require('swagger-jsdoc');

// Get list of docss
exports.index = function (req, res) {
    try {
        var options = {
            swaggerDefinition: {
                info: {
                    title: 'iPokers World', // Title (required)
                    version: '1.0.0' // Version (required)
                }
            },
            apis: ['./routes.js']// Path to the API docs
        };

        // Initialize swagger-jsdoc -> returns validated swagger spec in json format
        var swaggerSpec = swaggerJSDoc(options);

        res.status(200).json(swaggerSpec);

    } catch (err) {
        handleError(res, err);
    }
};

function handleError(res, err) {
    return res.status(500).send(err);
}