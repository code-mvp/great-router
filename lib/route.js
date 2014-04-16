
function Route(path) {
	this.path = path == null ? "" : path;
	this.isRoot = path == null ? true : false;
	this.stack = {};
	this.children = {};
	this.parent = null;
}

Route.prototype.use = function(method, callback) {
	method = method.toLowerCase();
	if (!Array.isArray(this.stack[method])) this.stack[method] = [];
	this.stack[method].push(callback);
	return this;
}

Route.prototype.get = function(path) {
	if (this.children[path] == null) {
		var child = new Route(path);
		this.children[path] = child;
		child.parent = this;
	}

	return this.children[path];
}

Route.prototype.has = function(path) {
	return this.children[path] != null;
}

Route.prototype.getCallbacks = function(method) {
	var cbs = this.stack[method.toLowerCase()];
	return Array.isArray(cbs) ? cbs.slice(0) : [];
}

module.exports = Route