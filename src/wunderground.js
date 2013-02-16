var API = require('common-api').API,
	Q = require('q');

var WeatherUnderground = function(api_key) {
	this.api_key = api_key;
};

WeatherUnderground.prototype = new API({
    hostname: 'api.wunderground.com',
    format:   API.FORMAT.JSON,
    base:     '/api/{api_key}',
    urlTransform: function(url) { return url.replace('{api_key}', this.api_key); }
});

WeatherUnderground.prototype.call2 = function(path) {
	var deferred = Q.defer();

	var options = {
	  host: 'api.wunderground.com',
	  port: 80,
	  path: '/api/' + this.api_key + path,
	  method: 'GET'
	};

	var req = http.request(options, function(res) {
		var output = '';
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			output += chunk;
		});

		res.on('end', function () {
			var json = JSON.parse(output);
			deferred.resolve(json);
		});
	});

	req.on('error', function(e) {
	  	deferred.reject('problem with request: ' + e.message);
	});

	req.end();

	return deferred.promise;
};

WeatherUnderground.prototype.geoforecast = function() {
	var deferred = Q.defer();

	this.call('/conditions/forecast/q/autoip.json').then(function(data) {
		deferred.resolve(data);

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

WeatherUnderground.prototype.geolocate = function() {
	var deferred = Q.defer();

	this.call('/geolookup/q/autoip.json').then(function(data) {
		if (!data.location) {
			var error = data.response.error;
			deferred.reject(error);

		} else {
			deferred.resolve(data.location);
		}

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

WeatherUnderground.prototype.queryForecast = function(path) {
	return this.forecast('/q/' + path);
};

WeatherUnderground.prototype.forecast = function(path) {
	var deferred = Q.defer(),
		url = '/conditions/forecast' + path  + '.json';

	this.call(url).then(function(data) {
		deferred.resolve(data);

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

exports.WeatherUnderground = WeatherUnderground;

