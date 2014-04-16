function Route(method, path) {
  this.method = method
  this.path = path
  this.callbacks = []

  // Children routes
  this.routes = {}
}
module.exports = Route