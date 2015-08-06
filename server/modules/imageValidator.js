/**
 * Created by jakobgaardandersen on 01/08/15.
 */
var fs = require('fs');

function isImage(path) {
    // magicnumbers for jpg, png and bmp
    // http://www.astro.keele.ac.uk/oldusers/rno/Computing/File_magic.html#Image
    var magic = ['ffd8ffe0', '89504e47', '424d'];
    var buffer = fs.readFileSync(path);
    var magicNumber = buffer.toString('hex', 0, 4);
    return magic.indexOf(magicNumber) !== -1;
}

/**
 * The middleware that checks if the file that was uploaded was actually an image
 * */
module.exports = function (req, res, next) {
    if (req.files.image) {
        if (!isImage(req.files.image.path)) {
            fs.unlinkSync(req.files.image.path);
            return res.status(400).json({message: 'File was not an image'});
        }
    }
    next();
};