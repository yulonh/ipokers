'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ArticleSchema = new Schema({
    title: String,
    content: String,
    author: String,
    cover: String,
    images: Array,
    origin: {type: String, unique: true},
    from: String,
    clicks: Number,
    createdAt: Date,
    updatedAt: Date,
    active: {type: Boolean, default: true}
});

module.exports = mongoose.model('Article', ArticleSchema);