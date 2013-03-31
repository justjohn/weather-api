var API = require('common-api').API,
	Q = require('q');

var Forecast = function(api_key) {
	this.api_key = api_key;
};

Forecast.prototype = new API({
    hostname: 'api.forecast.io',
    secure:   true,
    format:   API.FORMAT.JSON,
    base:     '/forecast/{api_key}',
    urlTransform: function(url) { return url.replace('{api_key}', this.api_key); }
});

Forecast.prototype.forecast = function(lat, lon, time) {
	var deferred = Q.defer();

	var timeStr = "";
	if (time !== undefined) {
		timeStr = "," + time;
	}

	this.call('/' + lat + "," + lon + timeStr).then(function(data) {
		deferred.resolve(data);

	}, function(err) {
		deferred.reject({
			type: 'callfail',
			description: err
		});
	});

	return deferred.promise;
};

exports.Forecast = Forecast;
