/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var datalayer = require('../db/datalayer');

/**
 *  For creating a new category. Requires a name and an image for the category.
 * */
router.post('/category', function (req, res) {
    // get args and validate
    if (!req.body.name || !req.files.image) {
        res.status(400).json({message: 'No name or image provided.'});
    } else {
        var name = req.body.name;

        // image is saved in ./server/db/uploads temporarily
        var imagePath = req.files.image.path;
        var contentType = req.files.image.mimetype;
        // file is a buffer object of image
        var image = fs.readFileSync(imagePath, {});

        datalayer.createCategory(name, image, contentType)
            .then(function (category) {
                // 201 indicates that a POST request created a new document
                res.status(201).json({message: 'Successfully created new category ' + category.name});
            }, function (error) {
                // the document already exists or some weird error happened
                if (error.code === 11000) {
                    res.status(400).json({message: 'The category \'' + name + '\' already exists!'})
                } else {
                    res.status(400).json(error);
                }
            })
            .finally(function () {
                // deletes the file from the server, as it was only there temp
                fs.unlinkSync(imagePath);
            });
    }
});

/**
 * Is for getting all the categories, excluding their image
 * */
router.get('/category', function (req, res) {
    datalayer.getAllCategories()
        .then(function (categories) {
            if (categories.length === 0) {
                res.status(404).json({message: 'No categories added yet.'})
            } else {
                res.json(categories);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});


/**
 * Is for getting a single category, if it exists, by id. Excluding image
 * */
router.get('/category/:id', function (req, res) {
    datalayer.getCategory(req.param('id'))
        .then(function (category) {
            if (category) {
                res.json(category);
            } else {
                res.status(404).json({message: 'No category with id ' + req.param('id')});
            }
        }, function (error) {
            res.status(500).json(error);
        });
});


/**
 * Returns the image for a given category
 * */
router.get('/category/image/:id', function (req, res) {
    datalayer.getCategory(req.param('id'), true)
        .then(function (category) {
            res.writeHead(200, {'Content-Type': category.contentType});
            res.end(category.image);
        }, function (error) {
            if (error.name === 'CastError') {
                res.status(404).json({message: 'No category with id ' + req.param('id')});
            } else {
                res.status(500).json(error);
            }
        });
});

module.exports = router;