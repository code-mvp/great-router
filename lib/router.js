var Route = require('./route')

function Router() {
  this.routes = {
    GET: new Route('GET', '/')
  }
}
module.exports = Router

Router.prototype.route = function(method, path, callback) {
  var pathParts = path === '/' ? [''] : path.split('/'),
      route = this.routes[method]

  for (var i = 1; i < pathParts.length; i++) {
    var pathPart = '/' + pathParts[i],
        cumulPath = pathParts.slice(0, i+1).join('/')
    if (cumulPath === '') cumulPath = '/'

    route = route.routes[pathPart] = route.routes[pathPart] || new Route(method, cumulPath)
  }

  route.callbacks.push(callback)
}
