'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    content: String,
    author: String,
    cover: String,
    images: Array,
    origin: {
        url: {type: String, unique: true},
        clicks: Number,
        from: String
    },
    createdAt: Date,
    updatedAt: Date,
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Article', ArticleSchema);