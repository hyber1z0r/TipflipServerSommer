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
                // deletes the file from the server, as it was only there temp
                fs.unlinkSync(imagePath);
                // 201 indicates that a POST request created a new document
                res.status(201).json(category);
            }, function (error) {
                // the document already exists or some weird error happened
                res.status(400).json(error);
            });
    }
});

module.exports = router;