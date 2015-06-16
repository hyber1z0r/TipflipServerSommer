/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var mongoose = require('mongoose');
var Category = mongoose.model('Category');
var Q = require('q');

/**
 * Creates a new category in the database
 * */
function createCategory(name, imagePath, contentType) {
    var deferred = Q.defer();

    cat = new Category({
        name: name,
        imagePath: imagePath,
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
    return Category.find({}).exec();
}

/**
 * Returns a category with given objectId, excluding its image.
 * @return Category
 * */
function getCategory(id) {
    return Category.findById(id).exec();
}

module.exports = {
    createCategory: createCategory,
    getAllCategories: getAllCategories,
    getCategory: getCategory
};