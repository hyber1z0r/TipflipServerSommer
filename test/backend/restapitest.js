/**
 * Created by jakobgaardandersen on 23/06/15.
 */
global.TEST_DATABASE = "mongodb://localhost/TipflipDB_test";
var chai = require('chai');
chai.use(require('chai-as-promised'));
var should = chai.should();
var request = require('supertest');
var app = require('../../server/app');
var insertScript = require('../sampledata/insertscript');


describe('RestAPI', function () {
    beforeEach(function (done) {
        insertScript.insert(function () {
            done();
        });
    });

    describe('Category', function () {
        it('should get all 5 categories', function (done) {
            request(app)
                .get('/api/category')
                .end(function (err, res) {
                    var categories = JSON.parse(res.text);
                    categories.length.should.equal(5);
                    should.not.exist(err);
                    done();
                });
        });

        it('should get 1 category', function (done) {
            var req = request(app);
            req.get('/api/category')
                .end(function (err, res) {
                    var categories = JSON.parse(res.text);
                    var category = categories[0];
                    req.get('/api/category/' + category._id)
                        .end(function (error, result) {
                            var fecthedCategory = JSON.parse(result.text);
                            category._id.should.equal(fecthedCategory._id);
                            category.name.should.equal(fecthedCategory.name);
                            category.imagePath.should.equal(fecthedCategory.imagePath);
                            category.contentType.should.equal(fecthedCategory.contentType);
                            should.not.exist(error);
                            done();
                        });
                });
        });

        it('should return 404 when no categories added yet', function (done) {
            insertScript.removeAll(function () {
                request(app)
                    .get('/api/category')
                    .expect(404)
                    .end(function (err, res) {
                        var response = JSON.parse(res.text);
                        response.message.should.equal('No categories added yet.');
                        should.not.exist(err);
                        done();
                    });
            });
        });

    });

    describe('Center', function () {
        it('should get all 3 centers', function (done) {
            request(app)
                .get('/api/center')
                .end(function (err, res) {
                    var centers = JSON.parse(res.text);
                    centers.length.should.equal(3);
                    should.not.exist(err);
                    done();
                });
        });

    });

    describe('Store', function () {
        it('should get all 8 stores', function (done) {
            request(app)
                .get('/api/store')
                .end(function (err, res) {
                    var stores = JSON.parse(res.text);
                    stores.length.should.equal(8);
                    should.not.exist(err);
                    done();
                });
        });
    });

    describe('Offer', function () {
        it('should get all 8 offers', function (done) {
            request(app)
                .get('/api/offer')
                .end(function (err, res) {
                    var offers = JSON.parse(res.text);
                    offers.length.should.equal(8);
                    should.not.exist(err);
                    done();
                });
        });
    });
});