var express = require('express');
var router = express.Router();
var request = require('request');
var zlib = require('zlib');
var async = require('async');
var cheerio = require('cheerio');

router.all('/fetch/snapdeal/mobile', function(req, res, next) {
    urls = [];
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
                // var src = $(this).find('img.product-image').attr('src');
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


module.exports = router;
