// Classes for weather objects

class CurrentWeather {
    constructor(location, temperature, feels_like, humidity, wind_speed, visibility, icon, description) {
        this.location = location;
        this.time = new Date();
        this.temperature = temperature;
        this.feels_like = feels_like;
        this.humidity = humidity;
        this.wind_speed = wind_speed;
        this.visibility = visibility;
        this.icon = icon;
        this.description = description;
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

// Current unit
let unit = true;

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
    const description = weatherData.weather[0].description;
    const weather = new CurrentWeather(location, temperature, feels_like, humidity, wind_speed, visibility, icon, description);
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

// Cached dom
const main = document.querySelector('.main');
const forecast = document.querySelector('.forecast');
const specs = document.querySelector('.specs');

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

// Map for days

const daysMap = new Map();
daysMap.set(0, 'Sunday');
daysMap.set(1, 'Monday');
daysMap.set(2, 'Tuesday');
daysMap.set(3, 'Wednesday');
daysMap.set(4, 'Thursday');
daysMap.set(5, 'Friday');
daysMap.set(6, 'Saturday');

// Functions that put it all together

function render() {
    resetDOM();
    renderCurrentWeather();
    renderForecast();
    renderSpecs();
}

async function updateWeather(city) {
    weather.currentWeather = await fetchCurrentWeather(city);
    weather.forecastWeather = await fetchForecast(city);
    render();
}

// Render helper function i.e. dom manipulation

function resetDOM() {
    main.innerHTML = '';
    forecast.innerHTML = '';
    specs.innerHTML = '';
}

function renderCurrentWeather() {
    const container = document.createElement('div');
    container.classList.add('main-container');
    
    const description = document.createElement('div');
    description.classList.add('description');
    description.textContent = weather.currentWeather.description
    .toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

    const location = document.createElement('div');
    location.classList.add('location');
    location.textContent = weather.currentWeather.location;

    const date = document.createElement('div');
    date.classList.add('date');
    date.textContent = weather.currentWeather.time.toDateString();

    const time = document.createElement('div');
    time.classList.add('time');
    time.textContent = weather.currentWeather.time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const temperature = document.createElement('div');
    temperature.classList.add('main-temp', 'temperature');
    temperature.textContent = unit ? Math.round(kelvinToFahrenheit(parseInt(weather.currentWeather.temperature))) + ' °F' : Math.round(kelvinToCelcius(parseInt(weather.currentWeather.temperature))) + ' °C';

    const switcher = document.createElement('div');
    switcher.classList.add('switcher');
    switcher.textContent = (unit) ? 'Display °C' : 'Display °F';
    switcher.addEventListener('click', switchUnits);

    const icon = new Image();
    icon.classList.add('main-icon');
    icon.src = iconMap.get(weather.currentWeather.icon);

    const search = document.createElement('input');
    search.classList.add('search');
    search.setAttribute('placeholder', 'Search Location...')

    const submit = document.createElement('button');
    submit.classList.add('submit');
    submit.textContent = 'search';
    submit.addEventListener('click', searchLocation);

    container.appendChild(description);
    container.appendChild(location);
    container.appendChild(date);
    container.appendChild(time);
    container.appendChild(temperature);
    container.appendChild(switcher);
    container.appendChild(icon);
    container.appendChild(search);
    container.appendChild(submit);
    main.appendChild(container);
}

function renderForecast() {
    let counter = 0;
    for (const step of weather.forecastWeather) {
        counter++;
        // Only get 5 steps at 24 hour intervals i.e. the next 5 days
        // BUG: Need to get max and min temp among 8 steps
        if (counter % 8 !== 0) {
            continue;
        }
        
        let maximum = -100000;
        let minimum = 100000;
        for (let i = counter - 8; i < counter; i++) {
            if (weather.forecastWeather[i].max_temp > maximum) {
                maximum = weather.forecastWeather[i].max_temp;
            }
            if (weather.forecastWeather[i].min_temp < minimum) {
                minimum = weather.forecastWeather[i].min_temp;
            }
        }

        const container = document.createElement('div');
        container.classList.add('forecast-container');

        const subContainer = document.createElement('div');
        container.classList.add('forecast-subcontainer');

        const day = document.createElement('div');
        day.classList.add('day');
        day.textContent = daysMap.get(step.time.getDay());

        const max = document.createElement('div');
        max.classList.add('max', 'temperature');
        const min = document.createElement('div');
        min.classList.add('min', 'temperature');
        max.textContent = unit ? Math.round(kelvinToFahrenheit(parseInt(maximum))) + ' °F' : Math.round(kelvinToCelcius(parseInt(maximum))) + ' °C';
        min.textContent = unit ? Math.round(kelvinToFahrenheit(parseInt(minimum))) + ' °F' : Math.round(kelvinToCelcius(parseInt(minimum))) + ' °C';

        const icon = new Image();
        icon.classList.add('forecast-icon');
        icon.src = iconMap.get(step.icon);
        
        subContainer.appendChild(day);
        subContainer.appendChild(max);
        subContainer.appendChild(min);
        subContainer.appendChild(icon);
        container.appendChild(subContainer);
        forecast.appendChild(container);
    }
}

function renderSpecs() {
    const feelsLike = document.createElement('div');
    feelsLike.classList.add('spec-container');
    const feelsLikeIcon = new Image();
    feelsLikeIcon.classList.add('spec-icon');
    feelsLikeIcon.src = './images/basic-icons/feels-like.png';
    const feelsLikeTitle = document.createElement('div');
    feelsLikeTitle.classList.add('spec-title');
    feelsLikeTitle.textContent = 'Feels Like';
    const feelsLikeInfo = document.createElement('div');
    feelsLikeInfo.classList.add('spec-info', 'temperature');
    feelsLikeInfo.textContent = unit ? Math.round(kelvinToFahrenheit(parseInt(weather.currentWeather.feels_like))) + ' °F' : Math.round(kelvinToCelcius(parseInt(weather.currentWeather.feels_like))) + ' °C';
    feelsLike.appendChild(feelsLikeIcon);
    feelsLike.appendChild(feelsLikeTitle);
    feelsLike.appendChild(feelsLikeInfo);

    const humidity = document.createElement('div');
    humidity.classList.add('spec-container');
    const humidityIcon = new Image();
    humidityIcon.classList.add('spec-icon');
    humidityIcon.src = './images/basic-icons/raindrop.png';
    const humidityTitle = document.createElement('div');
    humidityTitle.classList.add('spec-title');
    humidityTitle.textContent = 'Humidity';
    const humidityInfo = document.createElement('div');
    humidityInfo.classList.add('spec-info');
    humidityInfo.textContent = weather.currentWeather.humidity + ' %';
    humidity.appendChild(humidityIcon);
    humidity.appendChild(humidityTitle);
    humidity.appendChild(humidityInfo);

    const visibility = document.createElement('div');
    visibility.classList.add('spec-container');
    const visibilityIcon = new Image();
    visibilityIcon.classList.add('spec-icon');
    visibilityIcon.src = './images/basic-icons/visibility.png';
    const visibilityTitle = document.createElement('div');
    visibilityTitle.classList.add('spec-title');
    visibilityTitle.textContent = 'Visibility';
    const visibilityInfo = document.createElement('div');
    visibilityInfo.classList.add('spec-info');
    visibilityInfo.textContent = weather.currentWeather.visibility + ' m';
    visibility.appendChild(visibilityIcon);
    visibility.appendChild(visibilityTitle);
    visibility.appendChild(visibilityInfo);

    const wind = document.createElement('div');
    wind.classList.add('spec-container');
    const windIcon = new Image();
    windIcon.classList.add('spec-icon');
    windIcon.src = './images/basic-icons/wind.png';
    const windTitle = document.createElement('div');
    windTitle.classList.add('spec-title');
    windTitle.textContent = 'Wind Speed';
    const windInfo = document.createElement('div');
    windInfo.classList.add('spec-info');
    windInfo.textContent = weather.currentWeather.wind_speed + ' m/s';
    wind.appendChild(windIcon);
    wind.appendChild(windTitle);
    wind.appendChild(windInfo);

    specs.appendChild(feelsLike);
    specs.appendChild(humidity);
    specs.appendChild(visibility);
    specs.appendChild(wind);
}

// Other functions

function fahrenheitToCelcius(temperature) {
    return (temperature - 32) * .5556;
}

function celciusToFahrenheight(temperature) {
    return temperature * 1.8 + 32;
}

function kelvinToCelcius(temperature) {
    return temperature - 273.15;
}

function kelvinToFahrenheit(temperature) {
    return 1.8 * (temperature - 273.15) + 32;
}

function switchUnits() {
    const temps = document.querySelectorAll('.temperature');
    const switcher = document.querySelector('.switcher');
    for (const temp of temps) {
        let text = temp.textContent.split(' ');
        if (unit) {
            temp.textContent = Math.round(fahrenheitToCelcius(parseInt(text[0]))) + ' °C';
        } else {
            temp.textContent = Math.round(celciusToFahrenheight(parseInt(text[0]))) + ' °F';
            switcher.textContent = (unit) ? 'Display °F' : 'Display °C';
        }
    }
    unit = !unit;
    switcher.textContent = (unit) ? 'Display °C' : 'Display °F';
}

function searchLocation() {
    let input = document.querySelector('input');
    updateWeather(input.value);
}

// START IT UP
updateWeather('Chicago');