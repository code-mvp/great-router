var assert = require('assert'),
    greatRouter = require('../');

describe('Router', function() {
  it('call routes', function() {
    var router = greatRouter(),
        called = '';

    router.get('/', function() { called += '/' });
    router.get('/users/new', function() { called += 'new' });
    router.get('/users/login', function() { called += 'login' });

    called = ''
    router.handle({ method: 'GET', path: '/' }, {}, function() {});
    assert.equal(called, '/');

    called = ''
    router.handle({ method: 'GET', path: '/users/new' }, {}, function() {});
    assert.equal(called, 'new');

    called = ''
    router.handle({ method: 'GET', path: '/users/login' }, {}, function() {});
    assert.equal(called, 'login');
  });

  it('call route with param', function() {
    var router = greatRouter(),
        params;

    router.get('/users/:id', function(req) { params = req.params });
    router.get('/users/:id/:page/end', function(req) { params = req.params });
    
    router.handle({ method: 'GET', path: '/users/10' }, {}, function() {});

    assert.equal(params.id, '10');

    router.handle({ method: 'GET', path: '/users/10/1/end' }, {}, function() {});

    assert.equal(params.id, '10');
    assert.equal(params.page, '1');
  });
});