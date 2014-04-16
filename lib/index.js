var proto = require("./router"),
	_ = require("underscore");

var router =
module.exports = function(options) {
	var router = function(req, res, done) {
		return router.handle(req, res, done);
	}

	_.extend(router, proto);
	router.init(options);
	
	return router;
}