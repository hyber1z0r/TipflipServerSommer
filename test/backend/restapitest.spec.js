/**
 * Created by jakobgaardandersen on 23/06/15.
 */
var should = require('should');
var request = require('supertest');
var app = require('../../server/app');
var insertScript = require('../sampledata/insertscript');
var path = require('path');
var fs = require('fs');

function cleanUpImg(url, callback) {
    request(app)
        .get(url)
        .end(function (err, res) {
            var item = JSON.parse(res.text);
            fs.unlinkSync(path.resolve(__dirname, '../../server/public/' + item.imagePath));
            callback();
        });
}

describe('RestAPI', function () {
    beforeEach(function (done) {
        insertScript.insert(function () {
            done();
        });
    });

    describe('Category', function () {
        it('should get all 5 categories', function (done) {
            request(app)
                .get('/api/categories')
                .end(function (err, res) {
                    var categories = JSON.parse(res.text);
                    categories.length.should.equal(5);
                    should.not.exist(err);
                    done();
                });
        });

        it('should get 1 category', function (done) {
            var req = request(app);
            req.get('/api/categories')
                .end(function (err, res) {
                    var categories = JSON.parse(res.text);
                    var category = categories[0];
                    req.get('/api/categories/' + category._id)
                        .end(function (error, result) {
                            var fetchedCategory = JSON.parse(result.text);
                            category._id.should.equal(fetchedCategory._id);
                            category.name.should.equal(fetchedCategory.name);
                            category.imagePath.should.equal(fetchedCategory.imagePath);
                            category.contentType.should.equal(fetchedCategory.contentType);
                            should.not.exist(error);
                            done();
                        });
                });
        });

        it('should return 204 (No Content) when no categories added yet', function (done) {
            insertScript.removeAll(function () {
                request(app)
                    .get('/api/categories')
                    .expect(204)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });

        it('should create a new category', function (done) {
            request(app)
                .post('/api/categories')
                .field('name', 'shoes')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(201);
                    should.exist(res.headers.location);
                    // notice capitalized Category name
                    JSON.parse(res.text).message.should.equal('Successfully created new category Shoes');
                    cleanUpImg(res.headers.location, function () {
                        done();
                    });
                });
        });

        it('should return 400 when name field is missing', function (done) {
            request(app)
                .post('/api/categories')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Name required!');
                    done();
                });
        });

        it('should return 400 when image field is missing', function (done) {
            request(app)
                .post('/api/categories')
                .field('name', 'shoes')
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Image required!');
                    done();
                });
        });

        it('should return 409 when the category already exists', function (done) {
            // the category 'Elektronik' already exists!
            request(app)
                .post('/api/categories')
                .field('name', 'Elektronik')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The category \'Elektronik\' already exists!');
                    done();
                });
        });

        it('should return 409 when the category already exists, CASE INSENSITIVE', function (done) {
            // the category 'Elektronik' already exists!
            request(app)
                .post('/api/categories')
                .field('name', 'eLeKTRoNik')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The category \'eLeKTRoNik\' already exists!');
                    done();
                });
        });
    });

    describe('Center', function () {
        it('should get all 3 centers', function (done) {
            request(app)
                .get('/api/centers')
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
                .get('/api/stores')
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
                .get('/api/offers')
                .end(function (err, res) {
                    var offers = JSON.parse(res.text);
                    offers.length.should.equal(5);
                    should.not.exist(err);
                    done();
                });
        });
    });
});