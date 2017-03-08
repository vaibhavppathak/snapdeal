// the middleware function
module.exports = function() {
    var mongoose = require('mongoose'); //require mongoose module
    var conn = mongoose.connect('mongodb://127.0.0.1/Snapdeal'); //connection to mongodb

    // create schema 
    var Schema = mongoose.Schema({}, {
        strict: false,
        collection: 'T_Shirt'
    });

    var snap_TShirt = conn.model('', Schema);
    return function(req, res, next) {
        req.fetch = snap_TShirt;
        next();
    }
}
