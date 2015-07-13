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
var path = require('path');


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

        it('should create a new category', function (done) {
            // Test field is a field i added, that deletes the photo from the server when we're testing
            request(app)
                .post('/api/category')
                .field('name', 'shoes')
                .field('test', 'true')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(201);
                    // notice capitalized Category name
                    JSON.parse(res.text).message.should.equal('Successfully created new category Shoes');
                    done();
                });
        });

        it('should return 400 when name field is missing', function (done) {
            request(app)
                .post('/api/category')
                .field('test', 'true')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('No image or name provided.');
                    done();
                });
        });

        it('should return 400 when image field is missing', function (done) {
            request(app)
                .post('/api/category')
                .field('name', 'shoes')
                .field('test', 'true')
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('No image or name provided.');
                    done();
                });
        });

        it('should return 409 when the category already exists', function (done) {
            // the category 'Elektronik' already exists!
            request(app)
                .post('/api/category')
                .field('name', 'Elektronik')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .field('test', 'true')
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The category \'Elektronik\' already exists!');
                    done();
                });
        });

        it('should return 409 when the category already exists, CASE INSENSITIVE', function (done) {
            // the category 'Elektronik' already exists!
            request(app)
                .post('/api/category')
                .field('name', 'eLeKTRoNik')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .field('test', 'true')
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
                    offers.length.should.equal(5);
                    should.not.exist(err);
                    done();
                });
        });
    });
});