const assert = require('chai').assert;
const nock = require('nock');
const Context = require('http-transport').context;

const WreckTransport = require('../lib/wreckTransport');

const url = 'http://www.example.com/';
const host = 'http://www.example.com';
const api = nock(host);
const path = '/';

const simpleResponseBody = 'Illegitimi non carborundum';
const requestBody = {
  foo: 'bar'
};
const responseBody = requestBody;

function createContext(url, method) {
  method = method || 'get';

  const ctx = Context.create();
  ctx.req
    .method(method)
    .url(url);
  return ctx;
}

describe('Wreck HTTP transport', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.cleanAll();
    api.get(path).reply(200, simpleResponseBody);
  });

  describe('.createRequest', () => {
    it('makes a GET request', () => {
      const ctx = createContext(url);
      const request = WreckTransport.createRequest(ctx);
      return request.execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 200);
          assert.equal(ctx.res.body, simpleResponseBody);
        });
    });

    it('makes a GET request with headers', () => {
      nock.cleanAll();
      nock(host, {
          reqheaders: {
            test: 'qui curat'
          }
        })
        .get(path)
        .reply(200, simpleResponseBody);


      const ctx = createContext(url);
      ctx.req.addHeader('test', 'qui curat');

      const request = WreckTransport.createRequest(ctx);
      return request.execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 200);
          assert.equal(ctx.res.body, simpleResponseBody);
        });
    });

    it('makes a GET request with query strings', () => {
      api.get('/?a=1').reply(200, simpleResponseBody);

      const ctx = createContext(url);
      ctx.req.addQuery('a', 1);

      const request = WreckTransport.createRequest(ctx);
      return request.execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 200);
          assert.equal(ctx.res.body, simpleResponseBody);
        });
    });

    it('makes a PUT request with a JSON body', () => {
      api.put(path, requestBody).reply(201, responseBody);
      const ctx = createContext(url, 'put');
      ctx.req.body(requestBody);

      return WreckTransport.createRequest(ctx)
        .execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 201);
          assert.deepEqual(ctx.res.body, responseBody);
        });
    });

    it('makes a POST request with a JSON body', () => {
      api.post(path, requestBody).reply(201, responseBody);
      const ctx = createContext(url, 'post');
      ctx.req.body(requestBody);

      return WreckTransport.createRequest(ctx)
        .execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 201);
          assert.deepEqual(ctx.res.body, responseBody);
        });
    });

    it('makes a DELETE request with a JSON body', () => {
      api.delete(path).reply(204);
      const ctx = createContext(url, 'delete');
      ctx.req.body(requestBody);

      return WreckTransport.createRequest(ctx)
        .execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 204);
        });
    });

    it('makes a PATCH request with a JSON body', () => {
      api.patch(path).reply(204);
      const ctx = createContext(url, 'patch');
      ctx.req.body(requestBody);

      return WreckTransport.createRequest(ctx)
        .execute()
        .catch(assert.ifError)
        .then((ctx) => {
          assert.equal(ctx.res.statusCode, 204);
        });
    });

    it('sets a timeout', () => {
      nock.cleanAll();
      api.get('/')
        .delay(500)
        .reply(200, simpleResponseBody);

      const ctx = createContext(url);
      ctx.req.timeout(20);

      return WreckTransport.createRequest(ctx)
        .execute()
        .then(() => {
          assert.fail('Expected request to timeout');
        })
        .catch((e) => {
          assert.ok(e);
          assert.equal(e.message, 'Request failed for get http://www.example.com/: Client request timeout');
        });
    });
  });
});
