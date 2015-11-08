'use strict';

var _ = require('lodash');
var Wechat = require('./wechat.model');
var crypto = require('crypto');

// Get list of wechats
exports.index = function (req, res) {
    var signature = req.query.signature,
        timestamp = req.query.timestamp,
        nonce = req.query.nonce,
        echostr = req.query.echostr;
    var token = 'yulonh';
    var array = [signature, timestamp, nonce].sort();
    var sha1 = crypto.createHash('sha1');
    sha1.update(array.join(''));
    var signature1 = sha1.digest('hex');
    console.log(req.query);
    console.log(signature1);
    if (signature === signature1) {
        res.status(200).send(echostr);
    } else {
        res.status(500).send('invalid failed!');
    }
};

// Get a single wechat
exports.show = function (req, res) {
    Wechat.findById(req.params.id, function (err, wechat) {
        if (err) {
            return handleError(res, err);
        }
        if (!wechat) {
            return res.status(404).send('Not Found');
        }
        return res.json(wechat);
    });
};

// Creates a new wechat in the DB.
exports.create = function (req, res) {
    Wechat.create(req.body, function (err, wechat) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(wechat);
    });
};

// Updates an existing wechat in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Wechat.findById(req.params.id, function (err, wechat) {
        if (err) {
            return handleError(res, err);
        }
        if (!wechat) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(wechat, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(wechat);
        });
    });
};

// Deletes a wechat from the DB.
exports.destroy = function (req, res) {
    Wechat.findById(req.params.id, function (err, wechat) {
        if (err) {
            return handleError(res, err);
        }
        if (!wechat) {
            return res.status(404).send('Not Found');
        }
        wechat.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

function handleError(res, err) {
    return res.status(500).send(err);
}