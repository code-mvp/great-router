var Route = require('./route'),
	_ = require("underscore"),
	methods = require("methods");

router =
module.exports = {};

router.init = function(options) {
	this.options = _.defaults(options || {}, {});
	this.root = new Route("");
}

router.route = function(method, path, callback) {
	var parts = _.compact(path.split('/')),
		route = this.root;

	while (parts.length) {
		route = route.getOrCreate(parts.shift());
	}

	route.addCallback(method, callback);
	return this;
}

methods.forEach(function(method) {
	router[method] = function(path, callback) {
		return this.route(method, path, callback);
	}
});

router.handle = function(req, res, done) {
	var parts = _.compact(req.path.split('/')),
			route = this.root;

	while (parts.length) {
		route = route.get(parts.shift());
		if (!route) return done();
	}

	route.handle(req, res, done);

	return this;
}