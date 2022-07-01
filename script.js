// Classes for weather objects

class CurrentWeather {
    constructor(location, temperature, feels_like, humidity, wind_speed, visibility, icon) {
        this.location = location;
        this.time = new Date();
        this.temperature = temperature;
        this.feels_like = feels_like;
        this.humidity = humidity;
        this.wind_speed = wind_speed;
        this.visibility = visibility;
        this.icon = icon;
    }
}

class ForecastWeather {
    constructor(time, min_temp, max_temp, icon) {
        this.time = new Date(time);
        this.min_temp = min_temp;
        this.max_temp = max_temp;
        this.icon = icon;
    }
}

// Functions to fetch json weather data for given city

function directGeocodingURL(city) {
    return 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=83080525097f77eaf7a6d4d574c3a146';
}

function currentWeatherURL(lat, lon) {
    return 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=83080525097f77eaf7a6d4d574c3a146';
}

function forecastWeatherURL(lat, lon) {
    return 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&appid=83080525097f77eaf7a6d4d574c3a146';
}

async function fetchCurrentWeather(city) {
    const coordinates = await fetchCoordinates(city);
    const response = await fetch(currentWeatherURL(coordinates[0], coordinates[1]), { mode: 'cors' });
    const data = await response.json();
    return filterCurrentWeather(data);
}

async function fetchForecast(city) {
    const coordinates = await fetchCoordinates(city);
    const response = await fetch(forecastWeatherURL(coordinates[0], coordinates[1]), { mode: 'cors' });
    const data = await response.json();
    return filterForecastWeather(data);
}

async function fetchCoordinates(city) {
    const response = await fetch(directGeocodingURL(city), { mode: 'cors' });
    const coordinates = await response.json(); 
    const lat = coordinates[0].lat;
    const lon = coordinates[0].lon;
    return [lat, lon];
}

// Functions to extract specific data from json

function filterCurrentWeather(weatherData) {
    const location = weatherData.name;
    const temperature = weatherData.main.temp;
    const feels_like = weatherData.main.feels_like;
    const humidity = weatherData.main.humidity;
    const wind_speed = weatherData.wind.speed;
    const visibility = weatherData.visibility;
    const icon = weatherData.weather[0].icon;
    const weather = new CurrentWeather(location, temperature, feels_like, humidity, wind_speed, visibility, icon);
    return weather;
}

function filterForecastWeather(forecastData) {
    const forecastList = [];
    for (const step of forecastData.list) {
        const time = (step.dt_txt).replace(' ', 'T');
        const min_temp = step.main.temp_min;
        const max_temp = step.main.temp_max;
        const icon = step.weather[0].icon;
        const forecast = new ForecastWeather(time, min_temp, max_temp, icon);
        forecastList.push(forecast);
    }
    return forecastList;
}

// Selected city storage
let weather = {
    currentWeather: undefined,
    forecastWeather: undefined,
}

// Map for icon id to icon png

const iconMap = new Map();
iconMap.set('01d', './images/weather-icons/01d.png');
iconMap.set('01n', './images/weather-icons/01n.png');
iconMap.set('02d', './images/weather-icons/02d.png');
iconMap.set('02n', './images/weather-icons/02n.png');
iconMap.set('03d', './images/weather-icons/03d.png');
iconMap.set('03n', './images/weather-icons/03n.png');
iconMap.set('04d', './images/weather-icons/04d.png');
iconMap.set('04n', './images/weather-icons/04n.png');
iconMap.set('09d', './images/weather-icons/09d.png');
iconMap.set('09n', './images/weather-icons/09n.png');
iconMap.set('10d', './images/weather-icons/10d.png');
iconMap.set('10n', './images/weather-icons/10n.png');
iconMap.set('11d', './images/weather-icons/11d.png');
iconMap.set('11n', './images/weather-icons/11n.png');
iconMap.set('13d', './images/weather-icons/13d.png');
iconMap.set('13n', './images/weather-icons/13n.png');
iconMap.set('50d', './images/weather-icons/50d.png');
iconMap.set('50n', './images/weather-icons/50n.png');

// Functions that put it all together

function render() {

}

async function updateWeather(city) {
    weather.currentWeather = await fetchCurrentWeather(city);
    weather.forecastWeather = await fetchForecast(city);
    console.log(weather);
}

// Render helper function i.e. dom manipulation

// Other functions

function convertTemperature(temperature) {
    // kelvin, celcius, fahreinheit
}