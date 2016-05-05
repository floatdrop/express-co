/* global it */

'use strict';

const assert = require('assert');
const expressGenerators = require('./index')(require('express'));
const request = require('supertest');

it('accepts generator as middleware', done => {
	const app = expressGenerators();

	app.get('/', function * (req, res) {
		res.send('it works!');
	});

	request(app)
		.get('/')
		.end((err, res) => {
			assert.ifError(err);
			assert.equal(res.text, 'it works!');
			done();
		});
});

it('does not call next middleware after res.send', done => {
	const app = expressGenerators();

	app.get('/', function * (req, res) {
		res.send('one');
	});

	app.get('/', function * (req, res) {
		res.send('two');
	});

	request(app)
		.get('/')
		.end((err, res) => {
			assert.ifError(err);
			assert.equal(res.text, 'one');
			done();
		});
});

it('pass throwed exception to error handler', done => {
	const app = expressGenerators();

	app.get('/', function * () {
		throw new Error('Bang!');
	});

	/* eslint-disable no-unused-vars */
	app.use((err, req, res, next) => {
		assert.equal(err.message, 'Bang!');
		res.sendStatus(500);
		next();
	});
	/* eslint-enable no-unused-vars */

	request(app).get('/').expect(500, done);
});

it('works with param method', done => {
	const app = expressGenerators();

	app.param('user', function * (req, res, id) {
		assert.equal(id, 42);
	});

	app.get('/:user', function * (req, res) {
		res.send('meh');
	});

	request(app).get('/42').expect(200, done);
});

it('works with app.route call', done => {
	const app = expressGenerators();

	app.route('/')
		.get(function * (req, res) {
			res.send('it works!');
		});

	request(app)
		.get('/')
		.end((err, res) => {
			assert.ifError(err);
			assert.equal(res.text, 'it works!');
			done();
		});
});

it('accepts old function as middleware', done => {
	const app = expressGenerators();

	app.get('/', (req, res) => {
		res.send('it works!');
	});

	request(app)
		.get('/')
		.end((err, res) => {
			assert.ifError(err);
			assert.equal(res.text, 'it works!');
			done();
		});
});

it('has static method', () => {
	assert.equal(typeof expressGenerators.static, 'function');
});
