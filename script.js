function directGeocodingURL(city) {
    return 'http://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=83080525097f77eaf7a6d4d574c3a146';
}

function weatherDataURL(lat, lon) {
    return 'https://api.openweathermap.org/data/2.5/weather?lat=' + lat + '&lon=' + lon + '&appid=83080525097f77eaf7a6d4d574c3a146';
}

async function fetchWeatherData(city) {
    const coordinates = await fetchCoordinates(city);
    const response = await fetch(weatherDataURL(coordinates[0], coordinates[1]), { mode: 'cors' });
    const weatherData = await response.json();
    console.log(weatherData);
}

async function fetchCoordinates(city) {
    const response = await fetch(directGeocodingURL(city), { mode: 'cors' });
    const coordinates = await response.json(); 
    const lat = coordinates[0].lat;
    const lon = coordinates[0].lon;
    return [lat, lon];
}