'use strict';

const co = require('co');
const methods = require('methods');
const slice = Array.prototype.slice;
const isGenerator = require('is-generator');

module.exports = function (express) {
	function expressGenerators() {
		return wrap(express());
	}

	expressGenerators.prototype = express;

	Object.assign(expressGenerators, express);

	if (express.Router) {
		expressGenerators.Router = function () {
			return wrap(new express.Router());
		};
	}

	return expressGenerators;
};

function wrap(app) {
	methods.forEach(method => {
		app[method] = wrapAppMethod(app[method]);
	});

	app.param = wrapParamMethod(app.param);
	app.use = wrapAppMethod(app.use);
	app.all = wrapAppMethod(app.all);
	app.del = app.delete;

	const _route = app.route;
	app.route = function () {
		return wrap(_route.apply(this, arguments));
	};

	return app;
}

function wrapAppMethod(route) {
	return function () {
		return route.apply(this, slice.call(arguments).map(convertGenerators));
	};
}

function wrapParamMethod(route) {
	return function (name, fn) {
		let cb = fn;

		if (isGenerator.fn(fn)) {
			cb = function (req, res, next, id) {
				co.wrap(fn).call(this, req, res, id).then(() => !res.finished && next(), next);
			};
		}

		return route.call(this, name, cb);
	};
}

function convertGenerators(v) {
	if (!isGenerator.fn(v)) {
		return v;
	}

	return function (req, res, next) {
		co.wrap(v).call(this, req, res).then(() => !res.finished && next(), next);
	};
}
