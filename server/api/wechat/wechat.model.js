'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var WechatSchema = new Schema({
  name: String,
  info: String,
  active: Boolean
});

module.exports = mongoose.model('Wechat', WechatSchema);