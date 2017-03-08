var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var cheerio = require('cheerio');

<!----- fetch T-Shirt data -------->

router.all('/fetch/snapdeal/mobile', function(req, res, next) {
    record1 = [];
    var url = ['https://www.snapdeal.com/products/mens-tshirts-polos?sort=plrty'];
    var fetch = req.fetch;
    async.eachSeries(url, scrapData, function(err, next) {
        if (!err)
            next();
    })

    function saveProduct(product, callback) {
        var record = new req.fetch({
            "LINK": product.LINK,
            "Name": product.Name,
            "Price": product.Price,
        });
        record.save(function(err, data) {
            if (err) {
                throw err;

                callback();
            } else {
                callback();
            }
        });
    }

    function scrapData(url, processData) {
        request(url, function(err, resp, body) {
            var $ = cheerio.load(body);
            // fetching url here
            $('.product-tuple-listing').each(function() {
                var name = $(this).find('p.product-title').text();
                var price = $(this).find('.product-desc-price').text();
                var href = $(this).find("a.noUdLine").attr("href");

                var product = { LINK: href, Name: name, Price: price };
                record1.push(product);
            });
            async.eachSeries(record1, saveProduct, function(err, result) {
                res.json("Fetch data saved");
            })
        });
    }

});



<!-----fetch mobile data---->

router.all('/fetch/snapdeal/mobile/full', function(req, res) {
    record1 = [];
    var url = ['https://www.snapdeal.com/'];
    var categoryUrl;
    var mobileUrl;

    function scrapHref(url, callback) {
        request(url, function(err, response, body) {
            var $ = cheerio.load(body);
            var href = $('#category2Data').find('.rightMenuLink ').attr('href');
            categoryUrl = [href];

            async.eachSeries(categoryUrl, scrapmobile, function(err) {
                callback();
            })
        })
    }

    function scrapmobile(categoryUrl, callback) {
        request(categoryUrl, function(err, response, detail) {
            var $ = cheerio.load(detail);
            var details = [];
            $('.trending-slider-csf').find('a').each(function() {
                details.push($(this).attr('href'))
            });
            mobileUrl = [details[6]];
            async.eachSeries(mobileUrl, scrapData, function(err) {
                callback();
            })
        })
    }

    function scrapData(mobileUrl, callback) {
        request(mobileUrl, function(err, resp, data) {
            var $ = cheerio.load(data);
            res.send(data);
            // fetching url here
            $('.product-tuple-image ').each(function() {
                var href = $(this).find('a').attr("href");
                var name = $(this).find(".product-image").attr('title');
                // var price = $(this).find('.product-desc-price').attr('display-price');
                var src = $(this).find("img.product-image").attr('src');
                var product = { LINK: href, NAME: name, SRC: src };
                record1.push(product);
            });
            async.eachSeries(record1, saveProduct, function(err, result) {
                callback()
            })
        });
    }

    function saveProduct(product, callback) {
        var record = new req.fetch({
            "LINK": product.LINK,
            "Name": product.NAME,
            "Src": product.SRC,
        });
        record.save(function(err, data) {
            if (err) {
                throw err;
                callback();
            } else {
                callback();
            }
        });
    }
    async.eachSeries(url, scrapHref, function(err, result) {

    })
});


module.exports = router;
