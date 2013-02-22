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

WeatherUnderground.prototype.geoforecast = function() {
	var deferred = Q.defer();

	this.call('/conditions/forecast/hourly/q/autoip.json').then(function(data) {
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
		url = '/conditions/forecast/hourly' + path  + '.json';

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

