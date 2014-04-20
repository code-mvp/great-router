function Route(path) {
	this.path = path;
	this.callbacks = [];
	this.subRoutes = {};
}
exports.Route = Route;

Route.prototype.add = function(path) {
  if (path[0] === ':') {
    return this.wildcardSubRoute = new Param(path);
  }
  return this.subRoutes[path] = new Route(path);
}

Route.prototype.get = function(path) {
  return this.subRoutes[path] || this.wildcardSubRoute;
}


function Param(path) {
  Route.call(this, path);
  this.name = path.slice(1);
}

Param.prototype = Object.create(Route.prototype);
exports.Param = Param.prototype.constructor = Param;

Param.prototype.passtrough = function(pathSlice, req, res) {
  var params = req.params = req.params || {};
  params[this.name] = pathSlice;
}
