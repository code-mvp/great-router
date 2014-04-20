function Route(path) {
	this.path = path;               // Part of the path.
	this.callbacks = [];            // Callbacks if this route is the endpoint.
	this.subRoutes = {};            // Children routes under this route.
	this.wildcardSubRoute = null;   // Route which is always called.
	this.fallbackSubRoute = null;   // Fallback route if non of the subRoutes match.
}
module.exports = Route;

Route.prototype.add = function(path) {
	if (path === '*') return this.wildcardSubRoute = new Star();

  if (path[0] === ':') return this.fallbackSubRoute = new Param(path);
  
  return this.subRoutes[path] = new Route(path);
}

Route.prototype.get = function(path) {
  return this.subRoutes[path] || this.fallbackSubRoute;
}


// Route part for a param, eg.: /users/:id
function Param(path) {
  Route.call(this, path);
  this.name = path.slice(1);
}

Param.prototype = Object.create(Route.prototype);
Param.prototype.constructor = Param;

Param.prototype.passtrough = function(pathSlice, req, res) {
  var params = req.params = req.params || {};
  params[this.name] = pathSlice;
}


// Route part for a global route, eg.: /users/*
function Star() {
	Route.call(this, '*');
}

Star.prototype = Object.create(Route.prototype);
Star.prototype.constructor = Star;

Star.prototype.passtrough = function(pathSlice, req, res) {
	this.callbacks.forEach(function(callback) {
	  callback(req, res);
	});
}
