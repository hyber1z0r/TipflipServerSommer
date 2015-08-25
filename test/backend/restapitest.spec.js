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
                            should.not.exist(error);
                            done();
                        });
                });
        });

        it('should return 400 when id is invalid', function (done) {
            var id = 'blalblal';
            request(app)
                .get('/api/categories/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(400);
                    var message = JSON.parse(res.text).message;
                    message.should.equal(id + ' is not a valid id');
                    done();
                });
        });

        it('should return 404 when id is valid but do not exist', function (done) {
            // Valid objectId, but doesn't exist
            var id = '558d2555fc9ea7751f9ad23c';
            request(app)
                .get('/api/categories/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(404);
                    var message = JSON.parse(res.text).message;
                    message.should.equal('No category with id ' + id);
                    done();
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

        it('should return 409 when the category already exists, padded with spaces', function (done) {
            // the category 'Elektronik' already exists!
            request(app)
                .post('/api/categories')
                .field('name', 'Elektronik ')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The category \'Elektronik \' already exists!');
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

        it('should get 1 center', function (done) {
            var req = request(app);
            req.get('/api/centers')
                .end(function (err, res) {
                    var centers = JSON.parse(res.text);
                    var center = centers[0];
                    req.get('/api/centers/' + center._id)
                        .end(function (error, result) {
                            var fecthedCenter = JSON.parse(result.text);
                            center._id.should.equal(fecthedCenter._id);
                            center.name.should.equal(fecthedCenter.name);
                            center.imagePath.should.equal(fecthedCenter.imagePath);
                            should.not.exist(error);
                            done();
                        });
                });
        });

        it('should return 400 when id is invalid', function (done) {
            var id = 'blalblal';
            request(app)
                .get('/api/centers/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(400);
                    var message = JSON.parse(res.text).message;
                    message.should.equal(id + ' is not a valid id');
                    done();
                });
        });

        it('should return 404 when id is valid but do not exist', function (done) {
            // Valid objectId, but doesn't exist
            var id = '558d2555fc9ea7751f9ad23c';
            request(app)
                .get('/api/centers/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(404);
                    var message = JSON.parse(res.text).message;
                    message.should.equal('No center with id ' + id);
                    done();
                });
        });

        it('should return 204 (No Content) when no centers added yet', function (done) {
            insertScript.removeAll(function () {
                request(app)
                    .get('/api/centers')
                    .expect(204)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });

        it('should create a new center', function (done) {
            request(app)
                .post('/api/centers')
                .field('name', 'Fields')
                .field('location', '55.6303988,12.5805021')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(201);
                    should.exist(res.headers.location);
                    // notice capitalized Category name
                    JSON.parse(res.text).message.should.equal('Successfully created new center Fields');
                    cleanUpImg(res.headers.location, function () {
                        done();
                    });
                });
        });

        it('should return 400 when name field is missing', function (done) {
            request(app)
                .post('/api/centers')
                .field('location', '55.6303988,12.5805021')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Name required!');
                    done();
                });
        });

        it('should return 400 when location field is missing', function (done) {
            request(app)
                .post('/api/centers')
                .field('name', 'Fields')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Location required!');
                    done();
                });
        });

        it('should return 400 when image field is missing', function (done) {
            request(app)
                .post('/api/categories')
                .field('name', 'Fields')
                .field('location', '55.6303988,12.5805021')
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Image required!');
                    done();
                });
        });

        it('should return 409 when the center already exists', function (done) {
            // the center 'Lyngby Storcenter' already exists!
            request(app)
                .post('/api/centers')
                .field('name', 'Lyngby Storcenter')
                .field('location', '55.6303988,12.5805021')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The center \'Lyngby Storcenter\' already exists!');
                    done();
                });
        });

        it('should return 409 when the center already exists, padded with spaces', function (done) {
            // the category 'Lyngby Storcenter' already exists!
            request(app)
                .post('/api/centers')
                .field('name', 'Lyngby Storcenter ')
                .field('location', '55.6303988,12.5805021')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The center \'Lyngby Storcenter \' already exists!');
                    done();
                });
        });

        it('should return 409 when the center already exists, CASE INSENSITIVE', function (done) {
            // the category 'Lyngby Storcenter' already exists!
            request(app)
                .post('/api/centers')
                .field('name', 'LynGbY stoRCEntEr')
                .field('location', '55.6303988,12.5805021')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(409);
                    JSON.parse(res.text).message.should.equal('The center \'LynGbY stoRCEntEr\' already exists!');
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

        it('should get 1 store', function (done) {
            var req = request(app);
            req.get('/api/stores')
                .end(function (err, res) {
                    var stores = JSON.parse(res.text);
                    var store = stores[0];
                    req.get('/api/stores/' + store._id)
                        .end(function (error, result) {
                            var fecthedStore = JSON.parse(result.text);
                            store._id.should.equal(fecthedStore._id);
                            store.name.should.equal(fecthedStore.name);
                            store.imagePath.should.equal(fecthedStore.imagePath);
                            should.not.exist(error);
                            done();
                        });
                });
        });

        it('should return 400 when id is invalid', function (done) {
            var id = 'blalblal';
            request(app)
                .get('/api/stores/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(400);
                    var message = JSON.parse(res.text).message;
                    message.should.equal(id + ' is not a valid id');
                    done();
                });
        });

        it('should return 404 when id is valid but do not exist', function (done) {
            // Valid objectId, but doesn't exist
            var id = '558d2555fc9ea7751f9ad23c';
            request(app)
                .get('/api/stores/' + id)
                .end(function (err, res) {
                    should.exist(err);
                    res.status.should.equal(404);
                    var message = JSON.parse(res.text).message;
                    message.should.equal('No store with id ' + id);
                    done();
                });
        });

        it('should return 204 (No Content) when no stores added yet', function (done) {
            insertScript.removeAll(function () {
                request(app)
                    .get('/api/stores')
                    .expect(204)
                    .end(function (err, res) {
                        should.not.exist(err);
                        done();
                    });
            });
        });

        it('should create a new store', function (done) {
            var req = request(app);
            req.get('/api/centers')
                .end(function (error, response) {
                    var centers = JSON.parse(response.text);
                    var center = centers[0];
                    req.post('/api/stores')
                        .field('name', 'Fætter BR')
                        .field('_center', center._id)
                        .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                        .end(function (err, res) {
                            res.status.should.equal(201);
                            should.exist(res.headers.location);
                            // notice capitalized Store name
                            JSON.parse(res.text).message.should.equal('Successfully created new store Fætter Br');
                            cleanUpImg(res.headers.location, function () {
                                done();
                            });
                        });
                });
        });

        it('should return 400 when name field is missing', function (done) {
            var req = request(app);
            req.get('/api/centers')
                .end(function (error, response) {
                    var centers = JSON.parse(response.text);
                    var center = centers[0];
                    req.post('/api/stores')
                        .field('_center', center._id)
                        .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                        .end(function (err, res) {
                            res.status.should.equal(400);
                            JSON.parse(res.text).message.should.equal('Name required!');
                            done();
                        });
                });
        });

        it('should return 400 when _center field is missing', function (done) {
            request(app)
                .post('/api/stores')
                .field('name', 'Fætter BR')
                .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
                .end(function (err, res) {
                    res.status.should.equal(400);
                    JSON.parse(res.text).message.should.equal('Center required!');
                    done();
                });
        });

        //it('should return 400 when image field is missing', function (done) {
        //    request(app)
        //        .post('/api/categories')
        //        .field('name', 'Fields')
        //        .field('location', '55.6303988,12.5805021')
        //        .end(function (err, res) {
        //            res.status.should.equal(400);
        //            JSON.parse(res.text).message.should.equal('Image required!');
        //            done();
        //        });
        //});
        // because two stores can have same name, they can even be in same center
        //it('should return 201 when the center already exists', function (done) {
        //    // the center 'Lyngby Storcenter' already exists!
        //    request(app)
        //        .post('/api/centers')
        //        .field('name', 'Lyngby Storcenter')
        //        .field('location', '55.6303988,12.5805021')
        //        .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
        //        .end(function (err, res) {
        //            res.status.should.equal(409);
        //            JSON.parse(res.text).message.should.equal('The center \'Lyngby Storcenter\' already exists!');
        //            done();
        //        });
        //});

        //it('should return 409 when the center already exists, padded with spaces', function (done) {
        //    // the category 'Lyngby Storcenter' already exists!
        //    request(app)
        //        .post('/api/centers')
        //        .field('name', 'Lyngby Storcenter ')
        //        .field('location', '55.6303988,12.5805021')
        //        .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
        //        .end(function (err, res) {
        //            res.status.should.equal(409);
        //            JSON.parse(res.text).message.should.equal('The center \'Lyngby Storcenter \' already exists!');
        //            done();
        //        });
        //});

        //it('should return 409 when the center already exists, CASE INSENSITIVE', function (done) {
        //    // the category 'Lyngby Storcenter' already exists!
        //    request(app)
        //        .post('/api/centers')
        //        .field('name', 'LynGbY stoRCEntEr')
        //        .field('location', '55.6303988,12.5805021')
        //        .attach('image', path.resolve(__dirname, '../../server/public/uploads/no-photo-grey_1x.png'))
        //        .end(function (err, res) {
        //            res.status.should.equal(409);
        //            JSON.parse(res.text).message.should.equal('The center \'LynGbY stoRCEntEr\' already exists!');
        //            done();
        //        });
        //});



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