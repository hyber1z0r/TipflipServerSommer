/**
 * Created by jakobgaardandersen on 12/06/15.
 */
global.TEST_DATABASE = "mongodb://localhost/TipflipDB_test";
var db = require('../../server/db/db');
var datalayer = require('../../server/db/datalayer');
var chai = require('chai');
chai.use(require('chai-as-promised'));
var expect = chai.expect;
var insertScript = require('../sampledata/insertscript');

describe('Sample test', function () {
    it('should just pass', function (done) {
        expect(true).to.equal(true);
        done();
    });
});

describe('Datalayer', function () {
    beforeEach(function (done) {
        insertScript.insert(function () {
            done();
        });
    });

    describe('getAllCategories', function () {
        it('should return 5 cat', function () {
            return expect(datalayer.getAllCategories()).to.eventually.have.length(5);
        });
    });

    describe('getAllCenters', function () {
        it('should return 3 centers', function () {
            return expect(datalayer.getAllCenters()).to.eventually.have.length(3);
        })
    })
});