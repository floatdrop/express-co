# express-generators [![Build Status](https://travis-ci.org/floatdrop/express-generators.svg?branch=master)](https://travis-ci.org/floatdrop/express-generators)

Use generators with Express.

## Installation

```bash
npm install express-generators
```

## Usage

```javascript
const express = require('express-generators')(require('express'));
const got = require('got');

const app = express();

app.get('/user/:id', function * (req, res) {
    const google = (yield got('google.com')).body;
    res.send(google);
});

app.listen(8000);
```

## Notes

Rather than using the `next()` method, `express-generators` detects if you have written to the response.

## license

MIT © Vsevolod Strukchinsky
