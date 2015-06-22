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