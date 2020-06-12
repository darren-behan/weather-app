// Pseudocode

// JS

// Create variables

var recentlySearchedCitiesArray = [];
var numberOfCitiesSearched = 0;

init();

// Event Listeners

// Create a click event for the city search box
// This event will update the recentlySearchedCitiesArray via storeSearchedCities() which will renderRecentSearchesElements()

// Create a function to initialize (init) the app

function init() {
  renderRecentSearchesElements();
  renderCurrentWeather();
  renderFiveDayForecast();
}

// Create a function to append recently searched cities to the search box

function renderRecentSearchesElements() {
  storeSearchedCities();
  console.log("Recent Searches HTML");
}

// Create a function to store the recently searched cities to a max of 8 within the array and ensuring the last searched city (in index 7) is removed with the most recent searched city taking index 0

function storeSearchedCities(city) {
  console.log("Cities Searched Array");
  locallyStoreSearchedCities();
}

// Create a function to locally store the search cities

function locallyStoreSearchedCities() {
  console.log("I'm a locally stored array");
}

// Create a function to append the weather for the city searched for the current day

function renderCurrentWeather() {
  console.log("Current weather HTML");
}

// Create a function to append the 5 day forecast for the city searched

function renderFiveDayForecast() {
  console.log("5-Day Forecast HTML");
}