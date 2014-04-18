
function Route(path) {
	this.path = path;
	this.callbacks = {
		// GET: [callback, callback, ...]
	};
	this.children = {};
	this.parent = null;
}

Route.prototype.use = function(method, callback) {
	method = method.toUpperCase();
	if (!this.callbacks[method]) this.callbacks[method] = [];
	this.callbacks[method].push(callback);
	return this;
}

Route.prototype.get = function(path) {
	var child = this.children[path];

	if (child == null) {
		child = new Route(path);
		this.children[path] = child;
		child.parent = this;
	}

	return child;
}

Route.prototype.has = function(path) {
	return this.children[path] != null;
}

Route.prototype.getCallbacks = function(method) {
	return this.callbacks[method] || [];
}

module.exports = Route