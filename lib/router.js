var Route = require('./route'),
	_ = require("underscore"),
	methods = require("methods");

router =
module.exports = {};

router.init = function(options) {
	this.options = _.defaults(options || {}, {});
	this.root = new Route();
}

router.route = function(method, path, callback) {
	var parts = _.compact(path.split('/')),
		route = this.root;

	while (parts.length) {
		route = route.get(parts.shift());
	}

	route.use(method, callback);
	return this;
}

methods.forEach(function(method) {
	router[method] = function(path, callback) {
		return this.route(method, path, callback);
	}
});

router.handle = function(req, res, done) {
	var parts = _.compact(req.path.split('/')),
		route = this.root,
		index = 0,
		ctx = this,
		part, callbacks, cb;

	while (parts.length) {
		part = parts.shift();
		if (!route.has(part)) return done();
		route = route.get(part);
	}

	callbacks = route.getCallbacks(req.method);

	(function next(err) {
		if (err != null) return done(err);

		cb = callbacks[index++];
		if (cb == null) return done();

		cb.call(ctx, req, res, next);
	})();

	return this;
}