/**
 * Created by jakobgaardandersen on 12/06/15.
 */
var mongoose = require('mongoose');
var dbURI;
var Schema = mongoose.Schema;

//This is set by the backend tests
if (typeof global.TEST_DATABASE != 'undefined') {
    dbURI = global.TEST_DATABASE;
} else {
    dbURI = 'mongodb://localhost/TipflipDB';
    //dbURI = 'mongodb://test:test@ds051841.mongolab.com:51841/tipflip';
}

mongoose.connect(dbURI);

mongoose.connection.on('connected', function () {
    console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function (err) {
    global.mongo_error = 'Not Connected to the database';
    console.error('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
    console.log('Mongoose disconnected');
});

process.on('SIGINT', function () {
    mongoose.connection.close(function () {
        console.log('Mongoose disconnected through app termination');
        process.exit(0);
    });
});

var CategorySchema = new Schema({
    name: {type: String, required: 'Category name required!', unique: true},
    image: {type: Buffer, contentType: String, required: 'An image for the category is required!'}
});
mongoose.model('Category', CategorySchema, 'categories');

var StoreSchema = new Schema({
    name: {type: String, required: true},
    image: {type: String},
    location: {type: String}
});
mongoose.model('Store', StoreSchema, 'stores');

var OffersSchema = new Schema({
    category: {type: mongoose.Schema.Types.ObjectId, ref: 'Category'},
    discount: {type: String, required: 'Discount required'},
    offer: {type: String, required: 'Offer desc required'},
    image: {type: String},
    created: {type: Date, default: Date.now()},
    expiration: {type: Date, required: 'Expiration date required'},
    store: {type: mongoose.Schema.Types.ObjectId, ref: 'Store', required: 'Store ref required'}
});
mongoose.model('Offer', OffersSchema, 'offers');

var ProfileSchema = new Schema({
    name: {type: String},
    regID: {type: String},
    categories: [{type: mongoose.Schema.Types.ObjectId, ref: 'Category'}],
    offers: [{type: mongoose.Schema.Types.ObjectId, ref: 'Offer'}]
});
mongoose.model('Profile', ProfileSchema, 'profiles');