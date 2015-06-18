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
            true.should.equal(false, 'Test not written yet');
        });
    });

    describe('getAllStores', function () {
        it('should return 8 offers', function () {
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
            true.should.equal(false, 'Test not written yet');
        });
    });
});