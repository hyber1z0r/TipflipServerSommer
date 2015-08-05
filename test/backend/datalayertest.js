/**
 * Created by jakobgaardandersen on 12/06/15.
 */
global.TEST_DATABASE = 'mongodb://localhost/TipflipDB_test';
var db = require('../../server/db/db');
var datalayer = require('../../server/db/datalayer');
var should = require('should');
var insertScript = require('../sampledata/insertscript');

// TODO: WRITE SOME MORE TESTS!!!

describe('Datalayer', function () {
    beforeEach(function (done) {
        insertScript.insert(function () {
            done();
        });
    });

    describe('Category', function () {
        describe('getAllCategories', function () {
            it('should return all 5 categories', function (done) {
                datalayer.getCategories()
                    .then(function (categories) {
                        categories.length.should.equal(5);
                        done();
                    });
            });
        });

        describe('getCategory', function () {
            it('should return a category object and be fulfilled if exists', function (done) {
                datalayer.getCategories()
                    .then(function (categories) {
                        return datalayer.getCategory(categories[0]._id)
                    })
                    .then(function (category) {
                        category.should.have.properties(['name', 'imagePath', 'contentType']);
                        done();
                    });
            });

            it('should be rejected if id is not valid', function (done) {
                datalayer.getCategory('blabla')
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        done();
                    });
            });

            it('should be fulfilled with null if id doesnt exist', function (done) {
                // this is a valid mongo object id format
                datalayer.getCategory('558d2555fc9ea7751f9ad23c')
                    .then(function (category) {
                        should.not.exist(category);
                        done();
                    });
            });
        });

        describe('createCategory', function () {
            it('should create a category and return an inserted with _id property', function (done) {
                var name = 'TestCat';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                datalayer.createCategory(name, imagePath, contentType)
                    .then(function (category) {
                        category.should.have.property('_id');
                        done();
                    });
            });

            it('should be rejected if category already exists', function (done) {
                var name = 'Elektronik'; // already exists
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                datalayer.createCategory(name, imagePath, contentType)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.code.should.equal(11000);
                        done();
                    });
            });

            it('should be rejected if name is not provided', function (done) {
                var name = undefined;
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                datalayer.createCategory(name, imagePath, contentType)
                    .then(function () {
                    }, function (err) {
                        err.name.should.equal('ValidationError');
                        err.errors.name.message.should.equal('Category name required!');
                        done();
                    });
            });

            it('should be rejected if imagePath is not provided', function (done) {
                var name = 'TestCat';
                var imagePath = undefined;
                var contentType = 'image/png';
                datalayer.createCategory(name, imagePath, contentType)
                    .then(function () {
                    }, function (err) {
                        err.name.should.equal('ValidationError');
                        err.errors.imagePath.message.should.equal('An imagepath for the category is required!');
                        done();
                    });
            });

            it('should be rejected if contentType is not provided', function (done) {
                var name = 'TestCat';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = undefined;
                datalayer.createCategory(name, imagePath, contentType)
                    .then(function () {
                    }, function (err) {
                        err.name.should.equal('ValidationError');
                        err.errors.contentType.message.should.equal('No contenttype provided!');
                        done();
                    });
            });
        });
    });

    describe('Center', function () {
        describe('getAllCenters', function () {
            it('should return 3 centers', function (done) {
                datalayer.getCenters()
                    .then(function (centers) {
                        centers.length.should.equal(3);
                        done();
                    });
            });
        });

        describe('getCenter', function () {
            it('should return a center object and be fulfilled if exists', function (done) {
                datalayer.getCenters()
                    .then(function (centers) {
                        return datalayer.getCenter(centers[0]._id)
                    })
                    .then(function (center) {
                        center.should.have.properties(['name', 'imagePath', 'contentType', 'location']);
                        done();
                    });
            });

            it('should be rejected if id is not valid', function (done) {
                datalayer.getCenter('blabla')
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        done();
                    });
            });

            it('should be fulfilled with null if id doesnt exist', function (done) {
                // this is a valid mongo object id format
                datalayer.getCenter('558d2555fc9ea7751f9ad23c')
                    .then(function (center) {
                        should.not.exist(center);
                        done();
                    });

            });
        });

        describe('createCenter', function () {
            it('should create a center and return an inserted with _id property', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        center.should.have.property('_id');
                        done();
                    });
            });

            it('should be rejected if center already exists', function (done) {
                var name = 'Lyngby Storcenter'; // already exists
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.code.should.equal(11000);
                        done();
                    });
            });

            it('should be rejected if name is not provided', function (done) {
                var name = undefined;
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.errors.name.message.should.equal('Center must have a name!');
                        done();
                    });
            });

            it('should be rejected if imagePath is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = undefined;
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.errors.imagePath.message.should.equal('An imagepath for the center is required!');
                        done();
                    });
            });

            it('should be rejected if contentType is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = undefined;
                var location = '23.323213,45.3123131';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.errors.contentType.message.should.equal('No contenttype provided!');
                        done();
                    });
            });

            it('should be rejected if location is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = undefined;
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.errors.location.message.should.equal('A location is required!');
                        done();
                    });
            });
        });
    });

    describe('Store', function () {
        describe('getAllStores', function () {
            it('should return 8 stores', function (done) {
                datalayer.getStores()
                    .then(function (stores) {
                        stores.length.should.equal(8);
                        done();
                    });
            });
        });

        describe('getStore', function () {
            it('should return a store object and be fulfilled if exists', function (done) {
                datalayer.getStores()
                    .then(function (stores) {
                        return datalayer.getStore(stores[0]._id)
                    })
                    .then(function (store) {
                        store.should.have.properties(['name', 'imagePath', 'contentType', '_center']);
                        done();
                    });
            });


            it('should be rejected if id is not valid', function (done) {
                datalayer.getStore('blabla')
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        done();
                    });
            });

            it('should be fulfilled with null if id doesnt exist', function (done) {
                // this is a valid mongo object id format
                datalayer.getStore('558d2555fc9ea7751f9ad23c')
                    .then(function (center) {
                        should.not.exist(center);
                        done();
                    });
            });
        });

        describe('createStore', function () {
            it('should create a store and return an inserted with _id property', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', imagePath, contentType, center._id)
                    })
                    .then(function (store) {
                        store.should.have.property('_id');
                        done();
                    });
            });

            it('should be rejected if name is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore(undefined, imagePath, contentType, center._id)
                    })
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.name.should.equal('ValidationError');
                        err.errors.name.message.should.equal('Name for store is required!');
                        done();
                    });
            });

            it('should be rejected if imagePath is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', undefined, contentType, center._id)
                    })
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.name.should.equal('ValidationError');
                        err.errors.imagePath.message.should.equal('An imagepath for the store is required!');
                        done();
                    });
            });

            it('should be rejected if contentType is not provided', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', imagePath, undefined, center._id)
                    })
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.name.should.equal('ValidationError');
                        err.errors.contentType.message.should.equal('No contenttype provided!');
                        done();
                    });
            });

            it('should be rejected if center is not provided', function (done) {
                var name = 'TestStore';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var _center = undefined;
                datalayer.createStore(name, imagePath, contentType, _center)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.name.should.equal('ValidationError');
                        err.errors._center.message.should.equal('A store must belong to a center!');
                        done();
                    });
            });

            it('should be rejected if center is provided but not valid', function (done) {
                var name = 'TestStore';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var _center = 'notvalidid';
                datalayer.createStore(name, imagePath, contentType, _center)
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        err.name.should.equal('ValidationError');
                        err.errors._center.name.should.equal('CastError');
                        done();
                    });
            });

            // it should be possible to have two of the same store in one center. This is typical for stores like 7-eleven
            // Quint is a store that already exists!
            it('should be fulfilled if store name and center already exists', function (done) {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('Quint', imagePath, contentType, center._id)
                    })
                    .then(function (store) {
                        store.should.have.property('_id');
                        done();
                    });
            });
        });

        describe('deleteStore', function () {
            it('should delete 1 store', function (done) {
                datalayer.getStores()
                    .then(function (stores) {
                        stores.length.should.equal(8);
                        return datalayer.deleteStore(stores[0]._id)
                    })
                    .then(function () {
                        return datalayer.getStores()
                    })
                    .then(function (storesUpdate) {
                        storesUpdate.length.should.equal(7);
                        done();
                    });
            });
        });
    });

    describe('Offer', function () {
        describe('getAllOffers', function () {
            it('should return 3 offers', function (done) {
                datalayer.getOffers()
                    .then(function (offers) {
                        offers.length.should.equal(5);
                        done();
                    });
            });
        });

        describe('getOffer', function () {
            it('should return an offer with given id', function (done) {
                datalayer.getOffers()
                    .then(function (offers) {
                        return datalayer.getOffer(offers[0]._id)
                    })
                    .then(function (offer) {
                        offer.should.have.properties(['_id', '_store', '_category']);
                        done();
                    });
            });

            it('should be rejected if id is not valid', function (done) {
                datalayer.getOffer('blabla')
                    .then(function () {
                    }, function (err) {
                        should.exist(err);
                        done();
                    });
            });

            it('should be fulfilled with null if id doesnt exist', function (done) {
                // this is a valid mongo object id format
                datalayer.getOffer('558d2555fc9ea7751f9ad23c')
                    .then(function (offer) {
                        should.not.exist(offer);
                        done();
                    });
            });
        });

        describe('createOffer', function () {
            it('should create an offer and return an inserted with _id property', function (done) {
                var discount = '20%';
                var description = 'I dag er der tilbud på iPhone covers fra Puro.';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var created = Date.now();
                var expiration = new Date('October 13, 2015 11:13:00');
                var stores;
                datalayer.getStores()
                    .then(function (data) {
                        stores = data;
                        return datalayer.getCategories()
                    })
                    .then(function (categories) {
                        return datalayer.createOffer(discount, description, imagePath,
                            contentType, created, expiration, stores[0]._id, categories[0]._id)
                    })
                    .then(function (offer) {
                        offer.should.have.property('_id');
                        done();
                    });
            });
            // TODO create the rest, even though i know they work.
        });

        describe('deleteOffer', function () {

        });
    });
});