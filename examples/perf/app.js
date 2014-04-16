var express = require("express"),
	_ = require("underscore"),
	GreatRouter = require("../../");

var LETTERS = ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"];

function randNum(min, max) {
	if (max == null) max = Math.max(0, min), min = Math.min(0, min);
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randLetters(n) {
	var r = "";
	for (var i = 0; i < n; i++) {
		r += LETTERS[randNum(LETTERS.length - 1)];
	}
	return r;
}

var erouter = express.Router(),
	grouter = GreatRouter(),
	routes = [],
	segs, route, t;

segs = _.times(10, function() {
	return randLetters(randNum(2, 5));
});

routes = _.times(5000, function() {
	return "/" + _.times(randNum(1, 6), function() {
		return segs[randNum(segs.length - 1)];
	}).join("/");
});

console.log("setting up express routes");
t = new Date;
_.each(routes, function(r) {
	erouter.get(r, function(req, res, next) {
		console.log("at express route " + req.path);
		next();
	});
});
console.log("that took " + (new Date - t) + "ms\n");

console.log("setting up great routes");
t = new Date;
_.each(routes, function(r) {
	grouter.get(r, function(req, res, next) {
		console.log("at great route " + req.path);
		next();
	});
});
console.log("that took " + (new Date - t) + "ms\n");

console.log("random route: ", routes[randNum(routes.length - 1)]);

var app = express();

app.use(function(req, res, next) {
	console.log("new request: " + req.method + " " + req.path + "\n");
	next();
});

app.use(function(req, res, next) {
	console.log("running as express route");
	t = new Date;
	erouter.handle(req, res, function() {
		console.log("that took " + (new Date - t) + "ms\n");
		next();
	});
});

app.use(function(req, res, next) {
	console.log("running as great route");
	t = new Date;
	grouter.handle(req, res, function() {;
		console.log("that took " + (new Date - t) + "ms\n");
		next();
	});
});

app.listen(3000, function() {
	console.log("Listening on port 3000...\n");
});