exports.WeatherUnderground = require('./src/wunderground').WeatherUnderground;

var api_key = process.env.WEATHER_API,
    API = new exports.WeatherUnderground(api_key);

API.geoforecast().then(function(data) {
    console.log(data);
});

// tests

