var RouteTree = require('./route_tree'),
	  _ = require("underscore"),
	  methods = require("methods");

var router = module.exports = {};

router.init = function(options) {
	this.options = _.defaults(options || {}, {});
	var trees = this.trees = {};
	methods.forEach(function(method) {
	  trees[method.toUpperCase()] = new RouteTree();
	})
}

router.route = function(method, path, callback) {
	var route = this.trees[method.toUpperCase()].add(path);

	route.callbacks.push(callback);

	return this;
}

methods.forEach(function(method) {
	router[method] = function(path, callback) {
		return this.route(method, path, callback);
	}
});

router.handle = function(req, res, done) {
	var tree = this.trees[req.method],
      route = tree.route(req, res),
			index = 0;

	(function next(err) {
		if (err != null) return done(err);

		var callback = route.callbacks[index++];
		if (callback == null) return done();

		callback(req, res, next);
	})();

	return this;
}