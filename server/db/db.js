/**
 * Created by jakobgaardandersen on 12/06/15.
 */
var mongoose = require('mongoose');
var fs = require('fs');
var path = require('path');
var idvalidator = require('mongoose-id-validator');
var Schema = mongoose.Schema;
// MONGODB_URI is set by the different enviroments, Mocha sets to the test_database, while node sets to production db
var dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI, {server: {auto_reconnect: true}});

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI + '\n');
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

// only if we're not testing, as we don't want to delete the test photo
function deletePhoto(path) {
    if (!process.env.TEST) {
        fs.unlinkSync(path);
    }
}

var centerSchema = new Schema({
    name: {type: String, required: 'Name required!', unique: true},
    imagePath: {type: String, required: 'Image required!'},
    contentType: {type: String, required: 'Contenttype required!'},
    location: {type: String, required: 'Location required!'}
});

centerSchema.pre('remove', function (next, done) {
    deletePhoto(path.resolve(__dirname, '../public/' + this.imagePath));
    var store = mongoose.model('Store');
    //TODO: Replace with findByIdAndRemove
    store.find({_center: this._id}).exec()
        .then(function (stores) {
            var len = stores.length;
            for (var i = 0; i < len; i++) {
                stores[i].remove();
            }
            done();
        });
    next();
});

mongoose.model('Center', centerSchema, 'centers');

var storeSchema = new Schema({
    name: {type: String, required: 'Name required!'},
    imagePath: {type: String, required: 'Image required!'},
    contentType: {type: String, required: 'Contenttype required!'},
    _center: {type: mongoose.Schema.Types.ObjectId, ref: 'Center', required: 'Center required!'}
});
storeSchema.plugin(idvalidator);

storeSchema.pre('remove', function (next, done) {
    deletePhoto(path.resolve(__dirname, '../public/' + this.imagePath));
    var offer = mongoose.model('Offer');
    //TODO: Replace with findByIdAndRemove
    offer.find({_store: this._id}).exec()
        .then(function (offers) {
            var len = offers.length;
            for (var i = 0; i < len; i++) {
                offers[i].remove();
            }
            done();
        });
    next();
});

mongoose.model('Store', storeSchema, 'stores');

var categorySchema = new Schema({
    name: {type: String, required: 'Name required!', unique: true},
    imagePath: {type: String, required: 'Image required!'},
    contentType: {type: String, required: 'Contenttype required!'}
});

categorySchema.pre('remove', function (next) {
    deletePhoto(path.resolve(__dirname, '../public/' + this.imagePath));
    var offer = mongoose.model('Offer');
    var profile = mongoose.model('Profile');
    //TODO: Replace with findByIdAndRemove
    offer.find({_category: this._id}).exec()
        .then(function (offers) {
            var len = offers.length;
            for (var i = 0; i < len; i++) {
                offers[i].remove();
            }
        });
    profile.update({_categories: this._id}, {$pull: {_categories: this._id}}).exec();
    next();
});

mongoose.model('Category', categorySchema, 'categories');

var offersSchema = new Schema({
    discount: {type: String, required: 'Discount required!'},
    description: {type: String, required: 'Description required!'},
    imagePath: {type: String, required: 'Image required!'},
    contentType: {type: String, required: 'Contenttype required!'},
    created: {type: Date, default: Date.now()},
    expiration: {type: Date, required: 'Expiration date required!'},
    _store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: 'Store required!'},
    _category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: 'Category required!'}
});
offersSchema.plugin(idvalidator);

offersSchema.pre('remove', function (next) {
    deletePhoto(path.resolve(__dirname, '../public/' + this.imagePath));
    var profile = mongoose.model('Profile');
    // remove the offer from all profiles that has received this offer
    profile.update({_offers: this._id}, {$pull: {_offers: this._id}}).exec();
    next();
});

mongoose.model('Offer', offersSchema, 'offers');

var profileSchema = new Schema({
    name: {type: String},
    regID: {type: String},
    _categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    _offers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}]
});
profileSchema.plugin(idvalidator);
mongoose.model('Profile', profileSchema, 'profiles');