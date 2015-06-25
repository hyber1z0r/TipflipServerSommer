/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Center = mongoose.model('Center');
var Store = mongoose.model('Store');
var Offer = mongoose.model('Offer');
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
 * Returns a category with given ObjectId
 * */
function getCategory(id) {
    return Category.findById(id).exec();
}

/**
 * Deletes a category with given ObjectId
 * */
function deleteCategory(id) {
    return Category.remove({_id: id}).exec();
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
 * Returns a center with given ObjectId.
 * */
function getCenter(id) {
    return Center.findById(id).exec();
}

/**
 * Deletes a center with given ObjectId
 * */
function deleteCenter(id) {
    return Center.remove({_id: id}).exec();
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
 * Returns a store with given ObjectId.
 * */
function getStore(id) {
    return Store.findById(id).exec();
}

/**
 * Deletes a store with given ObjectId
 * */
function deleteStore(id) {
    getStore(id)
        .then(function (store) {
            return store.remove().exec();
        });
}

/**
 * Creates a new offer in the database
 * */
function createOffer(discount, description, imagePath, contentType, created, expiration, _store, _category) {
    var deferred = Q.defer();

    var offer = new Offer({
        discount: discount,
        description: description,
        imagePath: imagePath,
        contentType: contentType,
        created: created,
        expiration: expiration,
        _store: _store,
        _category: _category
    });

    offer.save(function (err, o) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(o);
        }
    });

    return deferred.promise;
}

/**
 * Returns all offers
 * */
function getAllOffers() {
    return Offer.find({}).exec();
}

/**
 * Returns an offer with given ObjectId
 * */
function getOffer(id) {
    return Offer.findById(id).exec();
}

/**
 * Deletes an offer with given ObjectId
 * */
function deleteOffer(id) {
    return Offer.remove({_id: id}).exec();
}

module.exports = {
    createCategory: createCategory,
    getAllCategories: getAllCategories,
    getCategory: getCategory,
    deleteCategory: deleteCategory,

    createCenter: createCenter,
    getAllCenters: getAllCenters,
    getCenter: getCenter,
    deleteCenter: deleteCenter,

    createStore: createStore,
    getAllStores: getAllStores,
    getStore: getStore,
    deleteStore: deleteStore,

    createOffer: createOffer,
    getAllOffers: getAllOffers,
    getOffer: getOffer,
    deleteOffer: deleteOffer
};