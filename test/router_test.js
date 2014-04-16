var assert = require('assert'),
    Router = require('../lib/router')

describe('Router', function() {
  it('build routes tree', function() {
    var router = new Router()

    router.route('GET', '/', 'root callback')
    router.route('GET', '/users/new', 'new callback')
    router.route('GET', '/users/login', 'login callback')

    // console.log(pp(router.routes))

    var expectedRoutes = {
      method: 'GET',
      path: '/',
      callbacks: ['root callback'],
      routes: {
        '/users':  {
          method: 'GET',
          path: '/users',
          callbacks: [],
          routes: {
            '/new': {
              method: 'GET',
              path: '/users/new',
              callbacks: ['new callback'],
              routes: {}
            },
            '/login': {
              method: 'GET',
              path: '/users/login',
              callbacks: ['login callback'],
              routes: {}
            }
          }
        }
      }
    }

    assert.equal(pp(router.routes.GET), pp(expectedRoutes))
  })

  function pp(object) {
    return JSON.stringify(object, null, 4)
  }
})