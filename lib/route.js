
function Route(path) {
	this.path = path;
	this.callbacks = {
		// GET: [callback, callback, ...]
	};
	this.children = {};
	this.parent = null;
}

Route.prototype.addCallback = function(method, callback) {
	method = method.toUpperCase();
	if (!this.callbacks[method]) this.callbacks[method] = [];
	this.callbacks[method].push(callback);
	return this;
}

Route.prototype.getOrCreate = function(path) {
	var child = this.get(path);

	if (child == null) {
		child = this.create(path)
	}

	return child;
}

Route.prototype.create = function(path) {
	var route = new Route(path);
	this.children[path] = route;
	route.parent = this;
	return route;
}

Route.prototype.get = function(path) {
	return this.children[path];
}

Route.prototype.getCallbacks = function(method) {
	return this.callbacks[method] || [];
}

module.exports = Route