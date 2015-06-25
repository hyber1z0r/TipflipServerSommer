/**
 * Created by jakobgaardandersen on 12/06/15.
 */
var mongoose = require('mongoose');
var dbURI;
var Schema = mongoose.Schema;

//This is set by the backend tests
if (typeof global.TEST_DATABASE != 'undefined') {
    dbURI = global.TEST_DATABASE;
    //mongoose.set('debug', true);
} else {
    dbURI = 'mongodb://localhost/TipflipDB';
    //dbURI = 'mongodb://test:test@ds051841.mongolab.com:51841/tipflip';
}

mongoose.connect(dbURI, {server: {auto_reconnect: true}});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    console.error('Mongoose connection error: ' + err);
    mongoose.disconnect();
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

mongoose.connection.on('reconnected', function () {
    console.log('MongoDB reconnected!');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var centerSchema = new Schema({
    name: {type: String, required: 'Center must have a name!', unique: true},
    imagePath: {type: String, required: 'An imagepath for the center is required!'},
    contentType: {type: String, required: 'No contenttype provided!'},
    location: {type: String, required: 'A location is required!'}
});

centerSchema.pre('remove', function (next) {
    var store = mongoose.model('Store');
    store.remove({_center: this._id}).exec();
    next();
});

mongoose.model('Center', centerSchema, 'centers');

var storeSchema = new Schema({
    name: {type: String, required: 'Name for store is required!'},
    imagePath: {type: String, required: 'An imagepath for the store is required!'},
    contentType: {type: String, required: 'No contenttype provided!'},
    _center: {type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: 'A store must belong to a center!'}
});

storeSchema.pre('remove', function (next) {
    var offer = mongoose.model('Offer');
    offer.find({_store: this._id}).exec()
        .then(function (offers) {
            var len = offers.length;
            for(var i = 0; i < len; i++ ) {
                offers[i].remove();
            }
            next();
        });
});

mongoose.model('Store', storeSchema, 'stores');

var categorySchema = new Schema({
    name: {type: String, required: 'Category name required!', unique: true},
    imagePath: {type: String, required: 'An imagepath for the category is required!'},
    contentType: {type: String, required: 'No contenttype provided!'}
});

categorySchema.pre('remove', function (next) {
    var offer = mongoose.model('Offer');
    var profile = mongoose.model('Profile');
    offer.find({_category: this._id}).exec()
        .then(function (offers) {
            var len = offers.length;
            for(var i = 0; i < len; i++ ) {
                offers[i].remove();
            }
        });
    profile.update({_categories: this._id}, {$pull: {_categories: this._id}}).exec();
    next();
});

mongoose.model('Category', categorySchema, 'categories');

var offersSchema = new Schema({
    discount: {type: String, required: 'Discount required'},
    description: {type: String, required: 'Offer desc required'},
    imagePath: {type: String, required: 'An imagepath for the offer is required!'},
    contentType: {type: String, required: 'No contenttype provided!'},
    created: {type: Date, default: Date.now()},
    expiration: {type: Date, required: 'Expiration date required'},
    _store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: 'Store ref required'},
    _category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'}
});

offersSchema.pre('remove', function (next) {
    var profile = mongoose.model('Profile');
    // remove the offer from all profiles that has received this offer
    //profile.update({_offers: this._id}, {$pull: {_offers: this._id}}).exec();
    next();
});

mongoose.model('Offer', offersSchema, 'offers');

var profileSchema = new Schema({
    name: {type: String},
    regID: {type: String},
    _categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    _offers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}]
});
mongoose.model('Profile', profileSchema, 'profiles');