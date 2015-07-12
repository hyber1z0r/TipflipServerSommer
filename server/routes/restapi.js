/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var datalayer = require('../db/datalayer');

function isImage(path) {
    // magicnumbers for jpg, png and bmp
    // http://www.astro.keele.ac.uk/oldusers/rno/Computing/File_magic.html#Image
    var magic = ['ffd8ffe0', '89504e47', '424d'];
    var buffer = fs.readFileSync(path);
    var magicNumber = buffer.toString('hex', 0, 4);
    return magic.indexOf(magicNumber) !== -1;
}

var imageValidator = function (req, res, next) {
    if (req.files.image) {
        if (!isImage(req.files.image.path)) {
            fs.unlinkSync(req.files.image.path);
            return res.status(400).json({message: 'File was not an image'});
        }
    }
    next();
};

/**
 *  For creating a new category. Requires a name and an image for the category.
 * */
router.post('/category', imageValidator, function (req, res) {
    // get args and validate, also validate if image is an image!!
    if (!req.files.image || !req.body.name) {
        if (req.files.image) {
            // delete image
            fs.unlinkSync(req.files.image.path);
        }
        res.status(400).json({message: 'No image or name provided.'});
    } else {
        var name = req.body.name;
        var imagePath = req.files.image.path.replace('server/public/', '');
        var contentType = req.files.image.mimetype;
        datalayer.createCategory(name, imagePath, contentType)
            .then(function (category) {
                // 201 indicates that a POST request created a new document
                if (req.body.test === 'true') {
                    fs.unlinkSync(req.files.image.path);
                }
                res.status(201).json({message: 'Successfully created new category ' + category.name});
            }, function (error) {
                // the document already exists or some weird error happened
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    res.status(400).json({message: 'The category \'' + name + '\' already exists!'})
                } else {
                    res.status(400).json(error);
                }
            });
    }
});

/**
 * Is for getting all the categories
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
 * Is for getting a single category, if it exists, by id.
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
            if (error.name === 'CastError') {
                res.status(400).json({message: req.param('id') + ' is not a valid id'});
            } else {
                res.status(500).json(error);
            }
        });
});

/**
 * For creating a new center, requires an image, name and location
 * */
router.post('/center', imageValidator, function (req, res) {
    // get args and validate, also validate if image is an image!!
    if (!req.files.image || !req.body.name || !req.body.location) {
        if (req.files.image) {
            // delete image
            fs.unlinkSync(req.files.image.path);
        }
        res.status(400).json({message: 'No image, name or location provided.'});
    } else {
        var name = req.body.name;
        var imagePath = req.files.image.path.replace('server/public/', '');
        var contentType = req.files.image.mimetype;
        var location = req.body.location;
        datalayer.createCenter(name, imagePath, contentType, location)
            .then(function (center) {
                // 201 indicates that a POST request created a new document
                res.status(201).json({message: 'Successfully created new center ' + center.name});
            }, function (error) {
                // the document already exists or some weird error happened
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    res.status(400).json({message: 'The center \'' + name + '\' already exists!'})
                } else {
                    res.status(400).json(error);
                }
            });
    }
});

/**
 * Is for getting all centers.
 * */
router.get('/center', function (req, res) {
    datalayer.getAllCenters()
        .then(function (centers) {
            if (centers.length === 0) {
                res.status(404).json({message: 'No centers added yet.'})
            } else {
                res.json(centers);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a specific center, if the id is parsable by mongo, it'll return the center if found
 * or an appropriate message if not found
 * If the id is unparsable or the mongo is down, the error callback will be called with an appropriate message
 * */
router.get('/center/:id', function (req, res) {
    datalayer.getCenter(req.param('id'))
        .then(function (center) {
            if (center) {
                res.json(center);
            } else {
                res.status(404).json({message: 'No center with id ' + req.param('id')});
            }
        }, function (error) {
            if (error.name === 'CastError') {
                res.status(400).json({message: req.param('id') + ' is not a valid id'});
            } else {
                res.status(500).json(error);
            }
        });
});

/**
 * For creating a new store, requires an image, name and center
 * */
router.post('/store', imageValidator, function (req, res) {
    // get args and validate, also validate if image is an image!!
    if (!req.files.image || !req.body.name || !req.body._center) {
        if (req.files.image) {
            // delete image
            fs.unlinkSync(req.files.image.path);
        }
        res.status(400).json({message: 'No image, name or center provided.'});
    } else {
        var name = req.body.name;
        var imagePath = req.files.image.path.replace('server/public/', '');
        var contentType = req.files.image.mimetype;
        var _center = req.body._center;
        datalayer.createStore(name, imagePath, contentType, _center)
            .then(function (store) {
                // 201 indicates that a POST request created a new document
                res.status(201).json({message: 'Successfully created new store ' + store.name});
            }, function (error) {
                // the document already exists or some weird error happened
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    res.status(400).json({message: 'The store \'' + name + '\' already exists!'})
                } else {
                    res.status(400).json(error);
                }
            });
    }
});

/**
 * Is for getting all stores.
 * */
router.get('/store', function (req, res) {
    datalayer.getAllStores()
        .then(function (stores) {
            if (stores.length === 0) {
                res.status(404).json({message: 'No stores added yet.'})
            } else {
                res.json(stores);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a specific store, if the id is parsable by mongo, it'll return the store if found
 * or an appropriate message if not found
 * If the id is unparsable or the mongo is down, the error callback will be called with an appropriate message
 * */
router.get('/store/:id', function (req, res) {
    datalayer.getStore(req.param('id'))
        .then(function (store) {
            if (store) {
                res.json(store);
            } else {
                res.status(404).json({message: 'No store with id ' + req.param('id')});
            }
        }, function (error) {
            if (error.name === 'CastError') {
                res.status(400).json({message: req.param('id') + ' is not a valid id'});
            } else {
                res.status(500).json(error);
            }
        });
});

/**
 * For creating a new offer, requires an image, discount, description, expiration date, store and a category
 * */
router.post('/offer', imageValidator, function (req, res) {
    // get args and validate, also validate if image is an image!!
    if (!req.files.image || !req.body.discount || !req.body.description
        || !req.body.expiration || !req.body.store || !req.body.category) {
        if (req.files.image) {
            // delete image
            fs.unlinkSync(req.files.image.path);
        }
        res.status(400).json({message: 'No image, discount, description, expiration date, store or category provided.'});
    } else {
        var imagePath = req.files.image.path.replace('server/public/', '');
        var contentType = req.files.image.mimetype;
        var discount = req.body.discount;
        var description = req.body.description;
        var expiration = req.body.expiration;
        var _store = req.body._store;
        var _category = req.body._category;
        datalayer.createOffer(discount, description, imagePath, contentType, new Date(), expiration, _store, _category)
            .then(function (offer) {
                // 201 indicates that a POST request created a new document
                res.status(201).json({message: 'Successfully created new offer ' + offer.name});
            }, function (error) {
                // the document already exists or some weird error happened
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    res.status(400).json({message: 'The offer \'' + name + '\' already exists!'})
                } else {
                    res.status(400).json(error);
                }
            });
    }
});

/**
 * Is for getting all offers.
 * */
router.get('/offer', function (req, res) {
    datalayer.getAllStores()
        .then(function (offers) {
            if (offers.length === 0) {
                res.status(404).json({message: 'No offers added yet.'})
            } else {
                res.json(offers);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a specific offer, if the id is parsable by mongo, it'll return the store if found
 * or an appropriate message if not found
 * If the id is unparsable or the mongo is down, the error callback will be called with an appropriate message
 * */
router.get('/offer/:id', function (req, res) {
    datalayer.getOffer(req.param('id'))
        .then(function (offer) {
            if (offer) {
                res.json(offer);
            } else {
                res.status(404).json({message: 'No offer with id ' + req.param('id')});
            }
        }, function (error) {
            if (error.name === 'CastError') {
                res.status(400).json({message: req.param('id') + ' is not a valid id'});
            } else {
                res.status(500).json(error);
            }
        });
});


// TODO: Get my offers, that i've created as a store
// TODO: Get my offers i've received (user page)
// TODO: EDIT CENTER, OFFERS, STORES, CATEGORIES
// TODO: Get number of stores in my center

module.exports = router;