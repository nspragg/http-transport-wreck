[![Build Status](https://travis-ci.org/nspragg/http-transport-wreck.svg)](https://travis-ci.org/nspragg/http-transport-wreck) [![Coverage Status](https://coveralls.io/repos/github/nspragg/http-transport-wreck/badge.svg?branch=master)](https://coveralls.io/github/nspragg/http-transport-wreck?branch=master)

# HttpTransport

> Wreck Transport implementation

## Installation

```
npm install --save http-transport-wreck
```

## Usage

```js
Use the Wreck HTTP client: 

const url = 'http://example.com/';
const HttpTransport = require('http-transport');
const Wreck = require('http-transport-wreck');

HttpTransport.createClient(Wreck)
   .get(url)
   .asResponse()
   .then((res) => {
     if (res.statusCode === 200) {
       console.log(res.body);
     }
   });
});
```

## Test

```
npm test
```

## Documentation
For more examples and API details, see [API documentation](https://nspragg.github.io/http-transport-wreck/)

To generate a test coverage report:

```
npm run coverage
```
