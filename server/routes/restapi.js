/**
 * Created by jakobgaardandersen on 13/06/15.
 */
var express = require('express');
var router = express.Router();
var fs = require('fs');
var datalayer = require('../db/datalayer');
var imageValidator = require('../modules/imageValidator');
/**
 * For creating a new category. Requires a name and an image for the category.
 * Responds with 400 if required fields were not provided
 * Responds with 201 if the document is created successfully
 * Responds with 409 if the document is not unique
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.post('/categories', imageValidator, function (req, res) {
    var name = req.body.name;
    var imagePath = req.files.image ? req.files.image.path.replace('server/public/', '') : null;
    var contentType = imagePath ? req.files.image.mimetype : null;
    datalayer.createCategory(name, imagePath, contentType)
        .then(function (category) {
            // 201 indicates that a POST request created a new document
            // location for new category in response
            res.location('/api/categories/' + category._id);
            res.status(201).json({message: 'Successfully created new category ' + category.name});
        }, function (error) {
            if (req.files.image) {
                fs.unlinkSync(req.files.image.path);
            }
            if (error.name === 'ValidationError') {
                // I'll hardcode it for now, until i find a better way to do it
                var message;
                if (error.errors.name) {
                    message = error.errors.name.message;
                } else if (error.errors.imagePath) {
                    message = error.errors.imagePath.message;
                }
                res.status(400).json({message: message});
            } else if (error.code === 11000) {
                // 409 indicates that there was a conflict in creating the resource
                res.status(409).json({message: 'The category \'' + name + '\' already exists!'})
            } else {
                res.status(500).json(error);
            }
        });
});

/**
 * Is for getting all the categories
 * Responds with 200 if there are categories
 * Responds with 204 if there is no categories
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/categories', function (req, res) {
    datalayer.getCategories()
        .then(function (categories) {
            if (categories.length === 0) {
                res.status(204).end();
            } else {
                res.json(categories);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a single category, if it exists, by id.
 * Responds with 200 if the category exists
 * Responds with 404 if the category doesn't exist
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/categories/:id', function (req, res) {
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
 * Is for getting offers in a certain category
 * Responds with 200 if the offers exists
 * Responds with 204 if there is no offers for the valid id provided
 * (Note, that it doesn't respond with 404 even though there is no such category, but 204 instead)
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/categories/:id/offers', function (req, res) {
    datalayer.getCategoryOffers(req.param('id'))
        .then(function (offers) {
            if (offers.length === 0) {
                res.status(204).end();
            } else {
                res.json(offers);
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
 * Responds with 400 if required fields were not provided
 * Responds with 201 if the document is created successfully
 * Responds with 409 if the document is not unique
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.post('/centers', imageValidator, function (req, res) {
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
                res.location('/api/centers/' + center._id);
                res.status(201).json({message: 'Successfully created new center ' + center.name});
            }, function (error) {
                // the document already exists or some weird error happened
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    // 409 indicates that there was a conflict in creating the resource
                    res.status(409).json({message: 'The center \'' + name + '\' already exists!'})
                } else {
                    res.status(500).json(error);
                }
            });
    }
});

/**
 * Is for getting all centers.
 * Responds with 200 if there are centers
 * Responds with 204 if there is no centers
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/centers', function (req, res) {
    datalayer.getCenters()
        .then(function (centers) {
            if (centers.length === 0) {
                res.status(204).end();
            } else {
                res.json(centers);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a single center, if it exists, by id.
 * Responds with 200 if the center exists
 * Responds with 404 if the center doesn't exist
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/centers/:id', function (req, res) {
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

//router.delete('/centers/:id', function (req, res) {
//    datalayer.deleteCenter(req.param('id'))
//        .then(function () {
//            res.json({message: 'Success in deleting ' + id})
//        }, function (error) {
//            res.status(500).json({message: 'Server error'})
//        });
//});

/**
 * Is for getting all stores in a specific center
 * Responds with 200 if the stores exists
 * Responds with 204 if there is no stores for the valid id provided
 * (Note, that it doesn't respond with 404 even though there is no such center, but 204 instead)
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/centers/:id/stores', function (req, res) {
    datalayer.getCenterStores(req.param('id'))
        .then(function (stores) {
            if (stores.length === 0) {
                res.status(204).end();
            } else {
                res.json(stores);
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
 * Is for getting offers in a specific center
 * Responds with 200 if the offers exists
 * Responds with 204 if there is no offers for the valid id provided
 * (Note, that it doesn't respond with 404 even though there is no such center, but 204 instead)
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/centers/:id/offers', function (req, res) {
    datalayer.getCenterOffers(req.param('id'))
        .then(function (offers) {
            if (offers.length === 0) {
                res.status(204).end();
            } else {
                res.json(offers);
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
 * Responds with 400 if required fields were not provided
 * Responds with 201 if the document is created successfully
 * Responds with 409 if the document is not unique
 * Responds with 400 if the _center attribute is not valid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.post('/stores', imageValidator, function (req, res) {
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
                res.location('/api/stores/' + store._id);
                res.status(201).json({message: 'Successfully created new store ' + store.name});
            }, function (error) {
                // the document already exists or some weird error happened
                console.log(error);
                fs.unlinkSync(req.files.image.path);
                if (error.code === 11000) {
                    // 409 indicates that there was a conflict in creating the resource
                    res.status(409).json({message: 'The store \'' + name + '\' already exists!'})
                } else if (error.name === 'ValidationError') {
                    res.status(400).json({message: error.errors.name.message});
                } else {
                    res.status(500).json(error);
                }
            });
    }
});

/**
 * Is for getting all stores.
 * Responds with 200 if there are stores
 * Responds with 204 if there is no stores
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/stores', function (req, res) {
    datalayer.getStores()
        .then(function (stores) {
            if (stores.length === 0) {
                res.status(204).end();
            } else {
                res.json(stores);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * Is for getting a single store, if it exists, by id.
 * Responds with 200 if the store exists
 * Responds with 404 if the store doesn't exist
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/stores/:id', function (req, res) {
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
 * Is for getting offers in a certain store
 * Responds with 204 if there are no documents
 * Responds with 200 if there are documents
 * Responds with 400 if id is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/stores/:id/offers', function (req, res) {
    datalayer.getStoreOffers(req.param('id'))
        .then(function (offers) {
            if (offers.length === 0) {
                res.status(204).end();
            } else {
                res.json(offers);
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
 * Responds with 400 if required fields were not provided
 * Responds with 201 if the document is created successfully
 * Responds with 409 if the document is not unique
 * Responds with 400 if the _store or _category attribute is not valid TODO: test this
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.post('/offers', imageValidator, function (req, res) {
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
                    // 409 indicates that there was a conflict in creating the resource
                    res.status(409).json({message: 'The offer \'' + name + '\' already exists!'})
                } else if (error.name === 'ValidationError') {
                    res.status(400).json({message: error.errors._store.message || error.errors._category.message});
                } else {
                    res.status(500).json(error);
                }
            });
    }
});

/**
 * Is for getting all offers.
 * Responds with 200 if there are offers
 * Responds with 204 if there is no offers
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/offers', function (req, res) {
    datalayer.getOffers()
        .then(function (offers) {
            if (offers.length === 0) {
                res.status(204).end();
            } else {
                res.json(offers);
            }
        }, function (error) {
            res.status(500).json(error);
        });
});

/**
 * IIs for getting a single offer, if it exists, by id.
 * Responds with 200 if the store exists
 * Responds with 404 if the store doesn't exist
 * Responds with 400 if the id provided is invalid
 * Responds with 500 if there is a problem with the MongoDB
 * */
router.get('/offers/:id', function (req, res) {
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

/**
 * Is for getting the count of a model
 * Responds with 200 if model exists
 * Responds with 404 if the model doesn't exists
 * Responds with 500 if there is a problem with MongoDB
 * */
router.get('/count/:model', function (req, res) {
    datalayer.getCount(req.param('model'))
        .then(function (count) {
            res.json({count: count});
        }, function (err) {
            if (err.message) {
                res.status(404).json(err);
            } else {
                res.status(500).json(err);
            }
        });
});

module.exports = router;