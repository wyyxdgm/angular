var router = require("express").Router();
var Auth = require("../controller/auth");
var sendJson = require("../lib/response").sendJson;
var sendErr = require("../lib/response").sendErr;
var L = require("../lib/log");

function test(req, res) {
    res.send({
        "body": req.body,
        "params": req.params
    });
}

function test1(req, res) {
    L.info('test1');
    res.send({
        "body": req.body,
        "params": req.params
    });
}

function test2(req, res) {
    L.info('test2');
    res.send({
        "body": req.body,
        "params": req.params
    });
}


router.route('/get/test').get(test);
router.route('/get/test1/:a').get(test1);
router.route('/get/test2/:a/:b').get(test2);

router.route('/post/test').post(test);
router.route('/post/test1/:a').post(test1);
router.route('/post/test2/:a/:b').post(test2);

module.exports = router;