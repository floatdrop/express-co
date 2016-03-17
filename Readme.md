# express-generators [![Build Status](https://travis-ci.org/floatdrop/express-generators.svg?branch=master)](https://travis-ci.org/floatdrop/express-generators)

Use generators with Express.

## Installation

```bash
npm install express-generators
```

## Usage

```javascript
const express = require('express');
const expressGenerators = require('express-generators')(express);
const got = require('got');

const app = expressGenerators();

app.use('/callback', function (req, res, next) {
    got('google.com').then(r => {
        req.google = r;
        next();
    }, next);
});

app.use('/generator', function * (req, res) {
    req.google = yield got('google.com');
});

app.get('*', function * (req, res) {
    res.send(req.google.body);
});

app.listen(8000);
```

## API

### expressGenerators(express)

Returns patched Express constructor with patched `Router` class.

Following methods are wrapped to support generators:

- `app.get`, `app.post` and [other methods](https://github.com/jshttp/methods/blob/master/index.js#L42-L67) from [`methods`](https://www.npmjs.com/package/methods) package
- `app.use`
- `app.param`
- `app.route`
- `app.all`
- `app.del`

## Notes

Rather than using the `next()` method, `express-generators` detects if you have written to the response.

## License

MIT © Vsevolod Strukchinsky
