/* =========================================
   WEATHER DASHBOARD
   REST API + FETCH + ASYNC/AWAIT
========================================= */


/* =========================================
   API URLS
========================================= */

const GEOCODING_API =
    "https://geocoding-api.open-meteo.com/v1/search";

const WEATHER_API =
    "https://api.open-meteo.com/v1/forecast";


/* =========================================
   DOM ELEMENTS
========================================= */

const searchForm = document.getElementById("search-form");

const cityInput = document.getElementById("city-input");

const searchButton = document.getElementById("search-button");

const loadingMessage = document.getElementById("loading");

const errorMessage = document.getElementById("error-message");

const weatherSection = document.getElementById("weather-section");

const cityName = document.getElementById("city-name");

const countryName = document.getElementById("country-name");

const temperature = document.getElementById("temperature");

const weatherDescription =
    document.getElementById("weather-description");

const humidity = document.getElementById("humidity");

const windSpeed = document.getElementById("wind-speed");

const windDirection =
    document.getElementById("wind-direction");

const weatherCode =
    document.getElementById("weather-code");

const updatedTime =
    document.getElementById("updated-time");


/* =========================================
   WEATHER CODE DESCRIPTIONS
========================================= */

const weatherCodes = {

    0: "Clear sky",

    1: "Mainly clear",

    2: "Partly cloudy",

    3: "Overcast",

    45: "Fog",

    48: "Depositing rime fog",

    51: "Light drizzle",

    53: "Moderate drizzle",

    55: "Dense drizzle",

    56: "Light freezing drizzle",

    57: "Dense freezing drizzle",

    61: "Slight rain",

    63: "Moderate rain",

    65: "Heavy rain",

    66: "Light freezing rain",

    67: "Heavy freezing rain",

    71: "Slight snow fall",

    73: "Moderate snow fall",

    75: "Heavy snow fall",

    77: "Snow grains",

    80: "Slight rain showers",

    81: "Moderate rain showers",

    82: "Violent rain showers",

    85: "Slight snow showers",

    86: "Heavy snow showers",

    95: "Thunderstorm",

    96: "Thunderstorm with slight hail",

    99: "Thunderstorm with heavy hail"

};


/* =========================================
   SEARCH CITY
========================================= */

searchForm.addEventListener("submit", async function (event) {

    event.preventDefault();

    const city = cityInput.value.trim();

    if (city === "") {

        showError("Please enter a city name.");

        return;
    }

    await getWeather(city);

});


/* =========================================
   MAIN WEATHER FUNCTION
========================================= */

async function getWeather(city) {

    try {

        showLoading();

        hideError();

        hideWeather();


        /* =====================================
           STEP 1: FIND CITY COORDINATES
        ===================================== */

        const locationURL =
            `${GEOCODING_API}?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;


        const locationResponse =
            await fetch(locationURL);


        /* Check network/API response */

        if (!locationResponse.ok) {

            throw new Error(
                "Unable to connect to the location service."
            );

        }


        /* Convert response to JSON */

        const locationData =
            await locationResponse.json();


        /* Check whether city was found */

        if (
            !locationData.results ||
            locationData.results.length === 0
        ) {

            throw new Error(
                `City "${city}" was not found. Please check the spelling.`
            );

        }


        /* =====================================
           STEP 2: EXTRACT NESTED JSON DATA
        ===================================== */

        const location =
            locationData.results[0];


        const latitude =
            location.latitude;

        const longitude =
            location.longitude;

        const cityDisplayName =
            location.name;

        const country =
            location.country;


        /* =====================================
           STEP 3: FETCH WEATHER DATA
        ===================================== */

        const weatherURL =
            `${WEATHER_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m,wind_direction_10m&timezone=auto`;


        const weatherResponse =
            await fetch(weatherURL);


        /* Check weather response */

        if (!weatherResponse.ok) {

            throw new Error(
                "Unable to retrieve weather information."
            );

        }


        /* Convert weather response to JSON */

        const weatherData =
            await weatherResponse.json();


        /* =====================================
           STEP 4: GET CURRENT WEATHER OBJECT
        ===================================== */

        const currentWeather =
            weatherData.current;


        /* =====================================
           STEP 5: DISPLAY DATA
        ===================================== */

        displayWeather(
            cityDisplayName,
            country,
            currentWeather
        );


    } catch (error) {

        console.error(
            "Weather Error:",
            error
        );

        showError(
            error.message ||
            "Something went wrong. Please try again."
        );


    } finally {

        hideLoading();

    }

}


/* =========================================
   DISPLAY WEATHER
========================================= */

function displayWeather(
    city,
    country,
    weather
) {

    /* Location */

    cityName.textContent = city;

    countryName.textContent = country;


    /* Temperature */

    temperature.textContent =
        Math.round(weather.temperature_2m);


    /* Weather description */

    const description =
        getWeatherDescription(
            weather.weather_code
        );

    weatherDescription.textContent =
        description;


    /* Humidity */

    humidity.textContent =
        weather.relative_humidity_2m;


    /* Wind speed */

    windSpeed.textContent =
        weather.wind_speed_10m;


    /* Wind direction */

    windDirection.textContent =
        weather.wind_direction_10m;


    /* Weather code */

    weatherCode.textContent =
        weather.weather_code;


    /* Updated time */

    const currentTime =
        new Date(weather.time);

    updatedTime.textContent =
        `Last updated: ${currentTime.toLocaleString()}`;


    /* Show weather section */

    weatherSection.hidden = false;

}


/* =========================================
   GET WEATHER DESCRIPTION
========================================= */

function getWeatherDescription(code) {

    return weatherCodes[code] ||
        "Unknown weather condition";

}


/* =========================================
   SHOW LOADING
========================================= */

function showLoading() {

    loadingMessage.hidden = false;

    searchButton.disabled = true;

    searchButton.textContent = "Searching...";

}


/* =========================================
   HIDE LOADING
========================================= */

function hideLoading() {

    loadingMessage.hidden = true;

    searchButton.disabled = false;

    searchButton.textContent = "Search";

}


/* =========================================
   SHOW ERROR
========================================= */

function showError(message) {

    errorMessage.textContent = message;

    errorMessage.hidden = false;

}


/* =========================================
   HIDE ERROR
========================================= */

function hideError() {

    errorMessage.textContent = "";

    errorMessage.hidden = true;

}


/* =========================================
   HIDE WEATHER
========================================= */

function hideWeather() {

    weatherSection.hidden = true;

}