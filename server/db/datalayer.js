/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Center = mongoose.model('Center');
var Store = mongoose.model('Store');
var Q = require('q');

/**
 * Creates a new category in the database
 * */
function createCategory(name, imagePath, contentType) {
    var deferred = Q.defer();

    var cat = new Category({
        name: name,
        imagePath: imagePath,
        contentType: contentType
    });

    cat.save(function (err, category) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(category);
        }
    });

    return deferred.promise;
}

/**
 * Returns all categories
 * */
function getAllCategories() {
    return Category.find({}).exec();
}

/**
 * Returns a category with given objectId
 * */
function getCategory(id) {
    return Category.findById(id).exec();
}

/**
 * Creates a new center in the database
 * */
function createCenter(name, imagePath, contentType, location) {
    var deferred = Q.defer();

    var c = new Center({
        name: name,
        imagePath: imagePath,
        contentType: contentType,
        location: location
    });

    c.save(function (err, center) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(center);
        }
    });

    return deferred.promise;
}

/**
 * Returns all centers
 * */
function getAllCenters() {
    return Center.find({}).exec();
}

/**
 * Returns a center with given objectId.
 * */
function getCenter(id) {
    return Center.findById(id).exec();
}

/**
 * Creates a new store in the database
 * */
function createStore(name, imagePath, contentType, _center) {
    var deferred = Q.defer();

    var s = new Store({
        name: name,
        imagePath: imagePath,
        contentType: contentType,
        _center: _center
    });

    s.save(function (err, store) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(store);
        }
    });

    return deferred.promise;
}

/**
 * Returns all stores
 * */
function getAllStores() {
    return Store.find({}).exec();
}

/**
 * Returns a stores with given objectId.
 * */
function getStore(id) {
    return Store.findById(id).exec();
}

module.exports = {
    createCategory: createCategory,
    getAllCategories: getAllCategories,
    getCategory: getCategory,

    createCenter: createCenter,
    getAllCenters: getAllCenters,
    getCenter: getCenter,

    createStore: createStore,
    getAllStores: getAllStores,
    getStore: getStore
};