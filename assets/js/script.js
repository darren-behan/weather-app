// Create variables

var searchForm = $("#search-form");
var searchText = $("#input-text");
var searchedCities = $("#search-ul");

var recentlySearchedCitiesArray = [];

// OpenWeatherMap API Key
var APIKey = "a9bd055528b6c2f7e0ed40218ab0ce62";
// Building the URL required to query the database
var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=Bujumbura,Burundi&units=metric&appid=" + APIKey;

init();

// Create a function to append recently searched cities to the search box

function renderSearchHistory() {
  // Clear todoList element and update todoCountSpan
  searchedCities.html("");

  // Reverse recentlySearchedCitiesArray
  recentlySearchedCitiesArray.reverse();

  // Render a new li for each city searched
  for (var i = 0; i < 8; i++) {

    city = recentlySearchedCitiesArray[i];

    var recentSearchLi = $("<li>").attr("class", "list-group-item").data("index", i).text(city);

    searchedCities.append(recentSearchLi);
  }
}

// Create a function to call and store the API data

function apiCallCurrentWeather() {
  // Create an AJAX call to retrieve current weather
  $.ajax({
    url: queryURL,
    method: "GET"
  }).then(function(response) {
    var currentTemperature = response.main.temp;
    var currentHumidity = response.main.humidity;
    var currentWindSpeed = response.wind.speed;
    var cityCoordLat = response.coord.lat;
    var cityCoordLon = response.coord.lon;

    // Separate AJAX call to retrieve UV Index
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/uvi?lat=" + cityCoordLat + "&lon=" + cityCoordLon + "&appid=" + APIKey,
      method: "GET"
    }).then(function(response) {
      var currentUvIndex = response.value;
    });
    
  });
}

// Create a function to append the weather for the city searched for the current day

function renderCurrentWeather() {
  currentWeatherDiv = $(".rounded");
  weatherTodayDiv = $("<div>").attr("class", "list-group today-ul");
  weatherDateDiv = $("<div>").attr("class", "list-group-item current title");
  weatherDateH2 = $("<h2>").text("Dublin 1 (12/06/2020");
  weatherTempDiv = $("<div>")
    .attr("class", "list-group-item current temp")
    .text("Temperature: 90.9 F");
  weatherHumidityDiv = $("<div>")
    .attr("class", "list-group-item current humidity")
    .text("Humidity: 41%");
  weatherWindDiv = $("<div>")
    .attr("class", "list-group-item current wind")
    .text("Wind Speed: 4.7 KMPH");
  weatherUvIndexDiv = $("<div>")
    .attr("class", "list-group-item current uv-index")
    .text("UV Index: ");
  weatherUvIndexSpan = $("<span>")
    .attr("class", "rounded rounded-uv")
    .text("9.49");

  currentWeatherDiv.append(weatherTodayDiv);
  weatherTodayDiv.append(weatherDateDiv);
  weatherDateDiv.append(weatherDateH2);
  weatherTodayDiv.append(weatherTempDiv);
  weatherTodayDiv.append(weatherHumidityDiv);
  weatherTodayDiv.append(weatherWindDiv);
  weatherTodayDiv.append(weatherUvIndexDiv);
  weatherUvIndexDiv.append(weatherUvIndexSpan);
}

// Create a function to initialize (init) the app

function init() {
  // Get stored cities from localStorage
  // Parsing the JSON string to an object
  var storedCities = JSON.parse(localStorage.getItem("cities"));

  // If cities were retrieved from localStorage, update the recentlySearchedCitiesArray to it
  if (storedCities !== null) {
    recentlySearchedCitiesArray = storedCities;
  }

  // Render cities to the DOM
  renderSearchHistory();
  apiCallCurrentWeather();
  renderCurrentWeather();
  renderFiveDayForecastElements();
}

// Create a function to locally store the search cities

function locallyStoreSearchedCities() {
  // Stringify and set "cities" key in localStorage to recentlySearchedCitiesArray
  localStorage.setItem("cities", JSON.stringify(recentlySearchedCitiesArray));
}

// Event Listeners

// Create a click event for the city search box
// This event will update the recentlySearchedCitiesArray via storeSearchedCities() which will renderRecentSearchesElements()

$(document).on("submit", searchForm, function(event) {
  event.preventDefault();

  // Store the text from the input
  var cityTextArray = searchText.val().trim();

  // Return from function early if submitted cityText is blank
  if (cityTextArray === "") {
    return;
  }

  // Add new cityText to recentlySearchedCitiesArray, clear the input
  recentlySearchedCitiesArray.push(cityTextArray);
  searchText.val("");

  // Store updated recentlySearchedCitiesArray in localStorage, re-render the list
  locallyStoreSearchedCities();
  renderSearchHistory();
  apiCallCurrentWeather();
  renderCurrentWeather();
});

// Create a function to append the 5 day forecast for the city searched

function renderFiveDayForecastElements() {
  forecastRow = $(".forecast-row");

  for (var i = 0; i < 5; i++) {
    forecastDiv = $("<div>").attr(
      "class",
      "col-sm-2.4 rounded border forecast-day"
    );
    forecastTodayDiv = $("<div>").attr("class", "list-group today-ul");
    forecastDateDiv = $("<div>").attr("class", "forecast-date-div");
    forecastFaviconDiv = $("<div>").attr("class", "forecast-favicon-div");
    forecastTempDiv = $("<div>").attr("class", "forecast-temp-div");
    forecastHumidityDiv = $("<div>").attr("class", "forecast-humidity-div");
    forecastH4 = $("<h4>").html("13/06/2020");
    forecastFa = $("<i>")
      .attr("class", "fa fa-search")
      .attr("aria-hidden", "true");
    forecastSpanTemp = $("<span>").attr("class", "temp").html("Temp: 90.9 F");
    forecastSpanHumidity = $("<span>")
      .attr("class", "humidity")
      .html("Humidity: 41%");

    forecastRow.append(forecastDiv);
    forecastDiv.append(forecastTodayDiv);
    forecastTodayDiv.append(forecastDateDiv);
    forecastDateDiv.append(forecastH4);
    forecastTodayDiv.append(forecastFaviconDiv);
    forecastFaviconDiv.append(forecastFa);
    forecastTodayDiv.append(forecastTempDiv);
    forecastTempDiv.append(forecastSpanTemp);
    forecastTodayDiv.append(forecastHumidityDiv);
    forecastHumidityDiv.append(forecastSpanHumidity);
  }
}
