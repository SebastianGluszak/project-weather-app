// Classes for weather objects

class CurrentWeather {
    constructor(location, time, temperature, humidity, wind_speed, visibility, icon) {
        this.location = location;
        this.time = new Date(time);
        this.temperature = temperature;
        this.humidity = humidity;
        this.wind_speed = wind_speed;
        this.visibility = visibility;
        this.icon = icon;
    }
}

class ForecastWeather {
    constructor(time, min_temp, max_temp, icon) {
        this.time = time;
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

async function fetchWeatherData(city) {
    const coordinates = await fetchCoordinates(city);
    const response = await fetch(currentWeatherURL(coordinates[0], coordinates[1]), { mode: 'cors' });
    const weatherData = await response.json();
    console.log(weatherData);
    return weatherData;
}

async function fetchForecastData(city) {
    const coordinates = await fetchCoordinates(city);
    const response = await fetch(forecastWeatherURL(coordinates[0], coordinates[1]), { mode: 'cors' });
    const forecastData = await response.json();
    console.log(forecastData.list);
    return forecastData;
}

async function fetchCoordinates(city) {
    const response = await fetch(directGeocodingURL(city), { mode: 'cors' });
    const coordinates = await response.json(); 
    const lat = coordinates[0].lat;
    const lon = coordinates[0].lon;
    return [lat, lon];
}

// Functions to extract specific data from json

function getCurrentWeather(weatherData) {

}

function getForecastWeather(forecastData) {
    const forecastList = weatherData.list;
    for (const step of forecastList) {
        
    }
}

// Selected city storage


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

const date = new Date('2022-07-01T03:00:00');
console.log(date);