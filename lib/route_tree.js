var route = require('./route');

function RouteTree() {
  this.root = new route.Route("")
}
module.exports = RouteTree

RouteTree.prototype.parsePath = function(path) {
  return path.split('/').slice(1);
}

// Add a route at a given path or return the one already there.
RouteTree.prototype.add = function(path) {
  var parts = this.parsePath(path),
      route = this.root;

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    route = route.get(part) || route.add(part);
  }

  return route;
}

// Walk down the tree for `path`, calling `callback` on each node.
// Returns the final node or `undefined` if route is not found.
RouteTree.prototype.walk = function(path, callback) {
  var parts = this.parsePath(path),
      route = this.root;

  for (var i = 0; i < parts.length; i++) {
    var part = parts[i];
    route = route.get(part);
    if (route == null) return;
    callback(route, part);
  }

  return route;
}

// Route a req across the tree.
RouteTree.prototype.route = function(req, res) {
  return this.walk(req.path, function(route, pathSlice) {
    // Call the passtrough callback of the route if some.
    if (route.passtrough) route.passtrough(pathSlice, req, res)
  })
}