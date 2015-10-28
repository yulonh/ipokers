'use strict'

var _ = require('lodash');
var request = require('request');
var iconv = require('iconv-lite');
var cheerio = require('cheerio');
var Q = require('q');
var URL = require('url');
var Article = require('../../api/article/article.model');

function fetch(url) {
    var deferred = Q.defer();

    try {
        request.get({
            url: url,
            encoding: null
        }, function (error, response, body) {
            if (error) {
                deferred.reject(error);
            } else {
                var content = iconv.decode(body, 'gb2312')
                var $ = cheerio.load(content, {decodeEntities: false});
                deferred.resolve($);
            }

        });
    } catch (err) {
        deferred.reject(error);
    }

    return deferred.promise;
}


function fetchArticles(url) {
    //抓取一页的文章列表
    return fetch(url).then(function ($) {
        var ret = {
            articles: []
        };
        var nextPage = $('.next a');
        if(nextPage.text().indexOf('下一页') !== -1){
            var nextPage = $('.next a')[0].attribs.href;
            ret.nextUrl = URL.resolve(url, nextPage);
        }
        $('.arcilte_con .center li.content').each(function (i, item) {
            var article = {};
            var a = $('h2 a', item);
            var title = a.text();
            var url = a.attr('href');
            var cover = $('.detail img', item).attr('src');
            var clicks = $('.arcilte_info', item).text().match(/点击：(\d+)次/)[1];
            ret.articles.push({
                title: title,
                cover: cover,
                origin: url,
                clicks: +clicks
            });
        });

        return ret;
    }).then(function (data) {
        var queue = [];
        //抓取一篇文章的详细信息
        _.forEach(data.articles, function (article) {
            queue.push(
                fetch(article.origin).then(function ($) {
                    var info = $('.info').text();
                    article.createdAt = info.match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}/)[0];
                    article.author = info.match(/作者:(.*)点击/)[1];
                    article.from = info.match(/来源:(.*)作者/)[1];
                    article.content = $('.ar_in_cont_3.width100').html();
                    article.images = [].map.call($('.ar_in_cont_3 img'), function (img) {
                        console.log(img.attribs.src);
                        return img.attribs.src;
                    });
                    article.info = info;
                    return article;
                }).catch(function (err) {
                    article.err = err;
                    return article;
                })
            );
        });

        return Q.all(queue).then(function () {
            return data;
        });
    }).catch(function(err){
        return err;
    });
};

//
exports.running = false;
//Fecth all articles from http://www.dzpk.com/news/reader/index.html
function start(url){
    //
    if(exports.running){
        return;
    }
    //
    exports.curUrl = url;
    exports.running = true;
    //
    function loop(data){
        //下一页
        if(data.nextUrl){
            exports.curUrl = data.nextUrl;
            fetchArticles(data.nextUrl).then(loop);
        }else{
            exports.running = false;
        }
        Article.create(data.articles);
    }
    //
    fetchArticles(url).then(loop).catch(function(err){
        exports.running = false;
    });
};

exports.start = start;