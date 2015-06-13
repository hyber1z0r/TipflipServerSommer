/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Q = require('q');

function createCategory(name, image, contentType) {
    var deferred = Q.defer();

    cat = new Category({
        name: name,
        image: image,
        contentType: contentType
    });

    cat.save(function (err, category) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(category);
        }
    });

    return deferred.promise;
}

module.exports = {
    createCategory: createCategory
};