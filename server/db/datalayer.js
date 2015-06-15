/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Q = require('q');

/**
 * Creates a new category in the database
 * */
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

/**
 * Returns all categories, excluding their images
 * */
function getAllCategories() {
    return Category.find({}, '-image').exec();
}

/**
 * Returns a category with given objectId, excluding its image.
 * */
function getCategory(id, withImage) {
    // options is blank if we want image, else options is excluding image
    var options = withImage ? '' : '-image';
    return Category.findById(id, options).exec();
}

module.exports = {
    createCategory: createCategory,
    getAllCategories: getAllCategories,
    getCategory: getCategory
};