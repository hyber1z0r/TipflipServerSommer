var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res) {
    res.redirect('app/index.html');
});

router.post('/upload', function (req, res) {
    console.log(req.headers);
    console.log(req);
    res.send(console.dir(req.files));
});

module.exports = router;
