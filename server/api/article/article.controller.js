'use strict';

var _ = require('lodash');
var Article = require('./article.model');
var fetcher = require('../../components/fetcher');
var Q = require('q');

// Get list of articles
exports.index = function (req, res) {
    var params = _.extend({page: 1, size: 10}, req.query);
    if(params.page <= 0 || params.size <= 0){
        res.status(400).json({code: 1001, msg: '错误的参数'});
        return;
    }

    var start = (params.page - 1) * params.size;

    var items = Article.find().skip(start).limit(params.size).sort({updateAt: 1}).exec();
    var count = Article.count().exec();

    Q.all([items, count]).then(function (results) {
        res.status(200).json(_.extend(params, {items: results[0], total: results[1], from: start}));
    }).catch(function (err) {
        handleError(res, err);
    });


};

// Get a single article
exports.show = function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            return handleError(res, err);
        }
        if (!article) {
            return res.status(404).send('Not Found');
        }
        return res.json(article);
    });
};

// Creates a new article in the DB.
exports.create = function (req, res) {
    Article.create(req.body, function (err, article) {
        if (err) {
            return handleError(res, err);
        }
        return res.status(201).json(article);
    });
};

// Updates an existing article in the DB.
exports.update = function (req, res) {
    if (req.body._id) {
        delete req.body._id;
    }
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            return handleError(res, err);
        }
        if (!article) {
            return res.status(404).send('Not Found');
        }
        var updated = _.merge(article, req.body);
        updated.save(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(200).json(article);
        });
    });
};

// Deletes a article from the DB.
exports.destroy = function (req, res) {
    Article.findById(req.params.id, function (err, article) {
        if (err) {
            return handleError(res, err);
        }
        if (!article) {
            return res.status(404).send('Not Found');
        }
        article.remove(function (err) {
            if (err) {
                return handleError(res, err);
            }
            return res.status(204).send('No Content');
        });
    });
};

//Fecth all articles from http://www.dzpk.com/news/reader/index.html
exports.fetch = function (req, res) {
    fetcher.start('http://www.dzpk.com/news/reader/index.html');
    res.status(200).json(fetcher);
};

function handleError(res, err) {
    return res.status(500).send(err);
}