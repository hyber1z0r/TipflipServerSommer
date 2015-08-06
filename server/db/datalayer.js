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
 * Returns a promise with the created category if fulfilled
 * */
function createCategory(name, imagePath, contentType) {
    var deferred = Q.defer();

    var cat = new Category({
        name: name ? name.capitalize(true).trim() : name,
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
 * Returns promise for all categories
 * */
function getCategories() {
    return Category.find({}).exec();
}

/**
 * Returns promise for a category with given ObjectId
 * */
function getCategory(id) {
    return Category.findById(id).exec();
}

/**
 * Deletes a category with given ObjectId
 * Returns a promise
 * TODO: Replace with findByIdAndRemove
 * */
function deleteCategory(id) {
    var deferred = Q.defer();

    getCategory(id)
        .then(function (category) {
            if (category) {
                category.remove(function (err) {
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
 * Returns promise with an array of offers in a certain category
 * */
function getCategoryOffers(id) {
    return Offer.find({_category: id}).exec();
}

/**
 * Creates a new center in the database
 * Returns a promise with the created center if fulfilled
 * */
function createCenter(name, imagePath, contentType, location) {
    var deferred = Q.defer();

    var c = new Center({
        name: name ? name.capitalize(true).trim() : name,
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
 * Returns promise for all centers
 * */
function getCenters() {
    return Center.find({}).exec();
}

/**
 * Returns promise for a center with given ObjectId
 * */
function getCenter(id) {
    return Center.findById(id).exec();
}

/**
 * Deletes a center with given ObjectId
 * TODO: Replace with findByIdAndRemove
 * */
function deleteCenter(id) {
    var deferred = Q.defer();

    getCenter(id)
        .then(function (center) {
            if (center) {
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
 * Returns an array of stores in a specific center
 * */
function getCenterStores(id) {
    return Store.find({_center: id}).exec();
}

/**
 * Returns an array of offers in a specific center
 * */
function getCenterOffers(id) {
    return Store.find({_center: id}).exec()
        .then(function (stores) {
            return Offer.find({_store: {$in: stores}}).exec();
        });
}

/**
 * Creates a new store in the database
 * Returns a promise for the created store if fulfilled
 * */
function createStore(name, imagePath, contentType, _center) {
    var deferred = Q.defer();

    var s = new Store({
        name: name ? name.capitalize(true).trim() : name,
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
 * Returns a promise for all stores, with populated _center.name property
 * */
function getStores() {
    return Store.find({}).populate('_center', 'name').exec();
}

/**
 * Returns a promise for a store with given ObjectId, with populated _center.name property
 * */
function getStore(id) {
    return Store.findById(id).populate('_center', 'name').exec();
}

/**
 * Deletes a store with given ObjectId
 * TODO: replace with findByIdAndRemove
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
 * Returns a promise for an array of offers in a certain store
 * */
function getStoreOffers(id) {
    return Offer.find({_store: id}).exec();
}

/**
 * Creates a new offer in the database
 * Returns a promise for the created offer if fulfilled
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
 * Returns a promise all offers, with populated _store.name and _category.name properties
 * */
function getOffers() {
    return Offer.find({}).populate('_store', 'name').populate('_category', 'name').exec();
}

/**
 * Returns a promise for an offer with given ObjectId, with populated _store.name and _category.name properties
 * */
function getOffer(id) {
    return Offer.findById(id).populate('_store', 'name').populate('_category', 'name').exec();
}

/**
 * Deletes an offer with given ObjectId
 * TODO: replace with findByIdAndRemove
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

/**
 * Returns a promise for the number of documents in a given model
 * */
function getCount(model) {
    switch (model) {
        case 'categories':
            return Category.count({}).exec();
            break;
        case 'centers':
            return Center.count({}).exec();
            break;
        case 'stores':
            return Store.count({}).exec();
            break;
        case 'offers':
            return Offer.count({}).exec();
            break;
        default:
            var deferred = Q.defer();
            deferred.reject({message: 'Invalid model!'});
            return deferred.promise;
    }
}

module.exports = {
    createCategory: createCategory,
    getCategories: getCategories,
    getCategory: getCategory,
    deleteCategory: deleteCategory,
    getCategoryOffers: getCategoryOffers,

    createCenter: createCenter,
    getCenters: getCenters,
    getCenter: getCenter,
    deleteCenter: deleteCenter,
    getCenterStores: getCenterStores,
    getCenterOffers: getCenterOffers,

    createStore: createStore,
    getStores: getStores,
    getStore: getStore,
    deleteStore: deleteStore,
    getStoreOffers: getStoreOffers,

    createOffer: createOffer,
    getOffers: getOffers,
    getOffer: getOffer,
    deleteOffer: deleteOffer,

    getCount: getCount
};