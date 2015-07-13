/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Center = mongoose.model('Center');
var Store = mongoose.model('Store');
var Offer = mongoose.model('Offer');
var Q = require('q');
require('sugar');

/**
 * Creates a new category in the database
 * */
function createCategory(name, imagePath, contentType) {
    var deferred = Q.defer();

    var cat = new Category({
        name: name ? name.capitalize(true) : name,
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
function getCategories() {
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
    var deferred = Q.defer();

    getCategory(id)
        .then(function (category) {
            category.remove(function (err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        }, function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
}

/**
 * Creates a new center in the database
 * */
function createCenter(name, imagePath, contentType, location) {
    var deferred = Q.defer();

    var c = new Center({
        name: name ? name.capitalize(true) : name,
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
function getCenters() {
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
    var deferred = Q.defer();

    getCenter(id)
        .then(function (center) {
            if(center) {
                center.remove(function (err) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve();
                    }
                });
            } else {
                deferred.reject();
            }
        }, function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
}

/**
 * Creates a new store in the database
 * */
function createStore(name, imagePath, contentType, _center) {
    var deferred = Q.defer();

    var s = new Store({
        name: name ? name.capitalize(true) : name,
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
function getStores() {
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
    var deferred = Q.defer();

    getStore(id)
        .then(function (store) {
            store.remove(function (err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        }, function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
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
function getOffers() {
    return Offer.find({}).populate('_store', 'name').populate('_category', 'name').exec();
}

/**
 * Returns an offer with given ObjectId
 * */
function getOffer(id) {
    return Offer.findById(id).populate('_store', 'name').populate('_category', 'name').exec();
}

/**
 * Deletes an offer with given ObjectId
 * */
function deleteOffer(id) {
    var deferred = Q.defer();

    getOffer(id)
        .then(function (offer) {
            offer.remove(function (err) {
                if (err) {
                    deferred.reject(err);
                } else {
                    deferred.resolve();
                }
            });
        }, function (error) {
            deferred.reject(error);
        });

    return deferred.promise;
}

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories,
    getCategory: getCategory,
    deleteCategory: deleteCategory,

    createCenter: createCenter,
    getCenters: getCenters,
    getCenter: getCenter,
    deleteCenter: deleteCenter,

    createStore: createStore,
    getStores: getStores,
    getStore: getStore,
    deleteStore: deleteStore,

    createOffer: createOffer,
    getOffers: getOffers,
    getOffer: getOffer,
    deleteOffer: deleteOffer
};