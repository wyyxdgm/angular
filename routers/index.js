var router = require("express").Router();
var sendJson = require("../lib/response").sendJson;
var sendErr = require("../lib/response").sendErr;
var libDb = require("../lib/db");
var Logger = require("../lib/log");
var libDate = require("../lib/date");
/*router index*/
function renderIndex(req, res) {
    Logger.info('info test');
    Logger.error('error test')
    var src = req.originalUrl || "raw";
    var websitestat = libDb.getModel("websitestats");
    websitestat.upsert2({
        src: src,
        date: libDate.getDate(new Date())
    }, {
        $inc: {
            count: 1
        }
    });
    res.render("index");
}
router.get("/", renderIndex);
router.get("/index", renderIndex);
module.exports = router;