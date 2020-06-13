// Create variables

var recentlySearchedCitiesArray = [
  "Dublin 1",
  "Dublin 2",
  "Dublin 3",
  "Dublin 4",
  "Dublin 5",
  "Dublin 6",
  "Dublin 7",
  "Dublin 8",
];
var numberOfCitiesSearched = [
  "Temp: 90.9 F",
  "Temp: 90.9 F",
  "Temp: 90.9 F",
  "Temp: 90.9 F",
  "Temp: 90.9 F",
];

init();

// Event Listeners

// Create a click event for the city search box
// This event will update the recentlySearchedCitiesArray via storeSearchedCities() which will renderRecentSearchesElements()

// Create a function to initialize (init) the app

function init() {
  renderRecentSearchesElements();
  renderCurrentWeather();
  renderFiveDayForecastElements();
}

// Create a function to append recently searched cities to the search box

function renderRecentSearchesElements() {
  recentSearchUl = $(".search-ul");

  for (var i = 0; i < recentlySearchedCitiesArray.length; i++) {
    recentSearchLi = $("<li>");

    recentSearchLi.attr("class", "list-group-item");

    recentSearchLi.html(recentlySearchedCitiesArray[i]);

    recentSearchUl.append(recentSearchLi);
  }

  storeSearchedCities();
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
