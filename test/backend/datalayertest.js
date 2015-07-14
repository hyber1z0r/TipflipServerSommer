/**
 * Created by jakobgaardandersen on 12/06/15.
 */
global.TEST_DATABASE = "mongodb://localhost/TipflipDB_test";
var db = require('../../server/db/db');
var datalayer = require('../../server/db/datalayer');
var chai = require('chai');
chai.use(require('chai-as-promised'));
var should = chai.should();
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
            it('should return all 5 categories', function () {
                return datalayer.getCategories().should.eventually.have.length(5);
            });
        });

        describe('getCategory', function () {
            it('should return a category object and be fulfilled if exists', function () {
                datalayer.getCategories()
                    .then(function (categories) {
                        var randId = categories[0]._id;
                        return datalayer.getCategory(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType']);
                    });
            });

            it('should be rejected if id is not valid', function () {
                return datalayer.getCategory('blabla').should.be.rejected;
            });

            it('should be fulfilled with null if id doesnt exist', function () {
                // this is a valid mongo object id format
                return datalayer.getOffer('558d2555fc9ea7751f9ad23c').should.eventually.equal(null);
            });
        });

        describe('createCategory', function () {
            it('should create a category and return an inserted with _id property', function () {
                var name = 'TestCat';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                return datalayer.createCategory(name, imagePath, contentType).should.eventually.have.property('_id');
            });

            it('should be rejected if category already exists', function () {
                var name = 'Elektronik'; // already exists
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                return datalayer.createCategory(name, imagePath, contentType).should.be.rejected;
            });

            it('should be rejected if name is not provided', function () {
                var name = undefined;
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                return datalayer.createCategory(name, imagePath, contentType).should.be.rejected;
            });

            it('should be rejected if imagePath is not provided', function () {
                var name = 'TestCat';
                var imagePath = undefined;
                var contentType = 'image/png';
                return datalayer.createCategory(name, imagePath, contentType).should.be.rejected;
            });

            it('should be rejected if contentType is not provided', function () {
                var name = 'TestCat';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = undefined;
                return datalayer.createCategory(name, imagePath, contentType).should.be.rejected;
            });
        });
    });

    describe('Center', function () {
        describe('getAllCenters', function () {
            it('should return 3 centers', function () {
                return datalayer.getCenters().should.eventually.have.length(3);
            });
        });

        describe('getCenter', function () {
            it('should return a center object and be fulfilled if exists', function () {
                datalayer.getCenters()
                    .then(function (centers) {
                        var randId = centers[0]._id;
                        return datalayer.getCenter(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType', 'location']);
                    });
            });

            it('should be rejected if id is not valid', function () {
                return datalayer.getCenter('blabla').should.be.rejected;
            });

            it('should be fulfilled with null if id doesnt exist', function () {
                // this is a valid mongo object id format
                return datalayer.getOffer('558d2555fc9ea7751f9ad23c').should.eventually.equal(null);
            });
        });

        describe('createCenter', function () {
            it('should create a center and return an inserted with _id property', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                return datalayer.createCenter(name, imagePath, contentType, location).should.eventually.have.property('_id');
            });

            it('should be rejected if center already exists', function () {
                var name = 'Lyngby Storcenter'; // already exists
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                return datalayer.createCenter(name, imagePath, contentType, location).should.be.rejected;
            });

            it('should be rejected if name is not provided', function () {
                var name = undefined;
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                return datalayer.createCenter(name, imagePath, contentType, location).should.be.rejected;
            });

            it('should be rejected if imagePath is not provided', function () {
                var name = 'TestCenter';
                var imagePath = undefined;
                var contentType = 'image/png';
                var location = '23.323213,45.3123131';
                return datalayer.createCenter(name, imagePath, contentType, location).should.be.rejected;
            });

            it('should be rejected if contentType is not provided', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = undefined;
                var location = '23.323213,45.3123131';
                return datalayer.createCenter(name, imagePath, contentType, location).should.be.rejected;
            });

            it('should be rejected if location is not provided', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = undefined;
                return datalayer.createCenter(name, imagePath, contentType, location).should.be.rejected;
            });
        });
    });

    describe('Store', function () {
        describe('getAllStores', function () {
            it('should return 8 stores', function () {
                return datalayer.getStores().should.eventually.have.length(8);
            });
        });

        describe('getStore', function () {
            it('should return a store object and be fulfilled if exists', function () {
                datalayer.getStores()
                    .then(function (stores) {
                        var randId = stores[0]._id;
                        return datalayer.getStore(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType', '_center']);
                    });
            });

            it('should be rejected if id is not valid', function () {
                return datalayer.getStore('blabla').should.be.rejected;
            });

            it('should be fulfilled with null if id doesnt exist', function () {
                // this is a valid mongo object id format
                return datalayer.getOffer('558d2555fc9ea7751f9ad23c').should.eventually.equal(null);
            });
        });

        describe('createStore', function () {
            it('should create a store and return an inserted with _id property', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', imagePath, contentType, center._id).should.eventually.have.property('_id');
                    });
            });

            it('should be rejected if name is not provided', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore(undefined, imagePath, contentType, center._id).should.be.rejected;
                    });
            });

            it('should be rejected if imagePath is not provided', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', undefined, contentType, center._id).should.be.rejected;
                    });
            });

            it('should be rejected if contentType is not provided', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('TestStore', imagePath, undefined, center._id).should.be.rejected;
                    });
            });

            it('should be rejected if center is not provided', function () {
                var name = 'TestStore';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var _center = undefined;
                return datalayer.createStore(name, imagePath, contentType, _center).should.be.rejected;
            });

            it('should be rejected if center is provided but not valid', function () {
                var name = 'TestStore';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var _center = 'notvalidid';
                return datalayer.createStore(name, imagePath, contentType, _center).should.be.rejected;
            });

            // it should be possible to have two of the same store in one center. This is typical for stores like 7-eleven
            // Quint is a store that already exists!
            it('should be fulfilled if store name and center already exists', function () {
                var name = 'TestCenter';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var location = '23.3231231,32.3232332';
                datalayer.createCenter(name, imagePath, contentType, location)
                    .then(function (center) {
                        return datalayer.createStore('Quint', imagePath, contentType, center._id).should.eventually.have.property('_id');
                    });
            });
        });

        describe('deleteStore', function () {
            it('should delete 1 store', function (done) {
                datalayer.getStores()
                    .then(function (stores) {
                        stores.length.should.equal(8);
                        datalayer.deleteStore(stores[0]._id)
                            .then(function () {
                                datalayer.getStores()
                                    .then(function (storesUpdate) {
                                        storesUpdate.length.should.equal(7);
                                        done();
                                    });
                            });
                    });
            });
        });
    });

    describe('Offer', function () {
        describe('getAllOffers', function () {
            it('should return 3 offers', function () {
                return datalayer.getOffers().should.eventually.have.length(5);
            });
        });

        describe('getOffer', function () {
            it('should return an offer with given id', function () {
                datalayer.getOffers()
                    .then(function (offers) {
                        return datalayer.getOffer(offers[0]._id).should.eventually.have.properties(['_id', '_store.name', '_category.name']);
                    });
            });

            it('should be rejected if id is not valid', function () {
                return datalayer.getOffer('blabla').should.be.rejected;
            });

            it('should be fulfilled with null if id doesnt exist', function () {
                // this is a valid mongo object id format
                return datalayer.getOffer('558d2555fc9ea7751f9ad23c').should.eventually.equal(null);
            });
        });

        describe('createOffer', function () {
            it('should create an offer and return an inserted with _id property', function () {
                var discount = '20%';
                var description = 'I dag er der tilbud på iPhone covers fra Puro.';
                var imagePath = 'uploads/fakeimage.png';
                var contentType = 'image/png';
                var created = Date.now();
                var expiration = new Date('October 13, 2015 11:13:00');
                datalayer.getStores()
                    .then(function (stores) {
                        datalayer.getCategories()
                            .then(function (categories) {
                                return datalayer.createOffer(discount, description, imagePath,
                                    contentType, created, expiration, stores[0]._id, categories[0]._id)
                                    .should.eventually.have.property('_id');
                            });
                    });
            });
            // TODO create the rest, even though i know they work.
        });

        describe('deleteOffer', function () {

        });
    });
});