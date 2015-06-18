/**
 * Created by jakobgaardandersen on 17/06/15.
 */
var mongoose = require('mongoose');
var Center = mongoose.model('Center');
var Store = mongoose.model('Store');
var Category = mongoose.model('Category');
var Offer = mongoose.model('Offer');
var centers = require('./center.json');
var stores = require('./store.json');
var categories = require('./category.json');
var offers = require('./offer.json');

function insertCenters(callback) {
    Center.remove({}, function () {
        Center.create(centers, function (err, insertedCenters) {
            if (err) {
                console.log(err);
            } else {
                callback(insertedCenters);
            }
        });
    });
}

function insertStores(insertedCenters, callback) {
    for (var i = 0; i < stores.length; i++) {
        var rand = Math.floor(Math.random() * insertedCenters.length);
        stores[i]._center = insertedCenters[rand]._id;
    }
    Store.remove({}, function () {
        Store.create(stores, function (err, insertedStores) {
            callback(insertedStores);
        });
    });
}

function insertCategories(callback) {
    Category.remove({}, function () {
        Category.create(categories, function (err, insertedCategories) {
            callback(insertedCategories);
        });
    });
}

function insertOffers(categories, stores, callback) {
    for (var i = 0; i < offers.length; i++) {
        var randCat = Math.floor(Math.random() * categories.length);
        var randSt = Math.floor(Math.random() * stores.length);
        offers[i]._category = categories[randCat]._id;
        offers[i]._store = stores[randSt]._id;
        offers[i].created = Date.now();
    }
    Offer.remove({}, function () {
        Offer.create(offers, function (err, insertedOffers) {
            callback();
        });
    });
}

function insert(done) {
    insertCenters(function (centerData) {
        insertStores(centerData, function (storeData) {
            insertCategories(function (categoryData) {
                insertOffers(categoryData, storeData, function () {
                    done();
                });
            });
        });
    });
}

module.exports = {
    insert: insert
};