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

    describe('getAllCategories', function () {
        it('should return all 5 categories', function () {
            return datalayer.getAllCategories().should.eventually.have.length(5);
        });
    });

    describe('getCategory', function () {
        it('should return a category object and be fulfilled if exists', function () {
            datalayer.getAllCategories()
                .then(function (categories) {
                    var randId = categories[0]._id;
                    return datalayer.getCategory(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType']);
                });
        });

        it('should be rejected if id doesnt exist', function () {
            return datalayer.getCategory('blabla').should.be.rejected;
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


    describe('getAllCenters', function () {
        it('should return 3 centers', function () {
            return datalayer.getAllCenters().should.eventually.have.length(3);
        });
    });

    describe('getCenter', function () {
        it('should return a center object and be fulfilled if exists', function () {
            datalayer.getAllCenters()
                .then(function (centers) {
                    var randId = centers[0]._id;
                    return datalayer.getCenter(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType', 'location']);
                });
        });

        it('should be rejected if id doesnt exist', function () {
            return datalayer.getCenter('blabla').should.be.rejected;
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

    describe('getAllStores', function () {
        it('should return 8 stores', function () {
            return datalayer.getAllStores().should.eventually.have.length(8);
        });
    });

    describe('getStore', function () {
        it('should return a store object and be fulfilled if exists', function () {
            datalayer.getAllStores()
                .then(function (stores) {
                    var randId = stores[0]._id;
                    return datalayer.getStore(randId).should.eventually.have.properties(['name', 'imagePath', 'contentType', '_center']);
                });
        });

        it('should be rejected if id doesnt exist', function () {
            return datalayer.getStore('blabla').should.be.rejected;
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

        it('should be rejected if no center is provided', function () {
            var name = 'TestStore';
            var imagePath = 'uploads/fakeimage.png';
            var contentType = 'image/png';
            return datalayer.createStore(name, imagePath, contentType).should.be.rejected;
        });

        // it should be possible to have two of the same store in one center. This is typical for stores like 7-eleven
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
            datalayer.getAllStores()
                .then(function (stores) {
                    stores.length.should.equal(8);
                    datalayer.deleteStore(stores[0]._id)
                        .then(function () {
                            datalayer.getAllStores()
                                .then(function (storesUpdate) {
                                    storesUpdate.length.should.equal(7);
                                    done();
                                });
                        });
                });
        });
    });
});