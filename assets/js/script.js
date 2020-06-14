$(document).ready(function () {

  // Create variables

  var leftColumn = $(".col-sm-3");
  var current = $("#current");
  var searchForm = $("#search-form");
  var searchText = $("#input-text");
  var searchedCities = $("#search-ul");
  var currentWeatherDiv = $(".rounded");
  var weatherTodayDiv = $("<div>");
  var weatherDateDiv = $("<div>");
  var weatherDateH2 = $("<h2>");
  var weatherImg = $("<img>");
  var weatherTempDiv = $("<div>");
  var weatherHumidityDiv = $("<div>");
  var weatherWindDiv = $("<div>");
  var weatherUvIndexDiv = $("<div>");

  var recentlySearchedCitiesArray = [];
  var city = [];

  // OpenWeatherMap API Key
  var APIKey = "a9bd055528b6c2f7e0ed40218ab0ce62";

  // moment.js
  var currentDate = moment().format("dddd, MMMM Do YYYY");

  init();

  // Create a function to append recently searched cities to the search box

  function renderSearchHistory() {
    if (recentlySearchedCitiesArray.length !== 0) {
      // Clear searchedCities element
      searchedCities.html("");
      leftColumn.css("background-color", "rgb(247, 247, 247)");
    } else {
      // Clear searchedCities element & exit function
      searchedCities.html("");
      leftColumn.css("background-color", "rgb(255, 255, 255)");
      return;
    }

    // Reverse recentlySearchedCitiesArray
    recentlySearchedCitiesArray.reverse();

    // Render a new li for each city searched
    for (var i = 0; i < 8; i++) {
      city = recentlySearchedCitiesArray[i];

      var recentSearchLi = $("<li>")
        .attr("class", "list-group-item")
        .data("index", i)
        .text(city);

      searchedCities.append(recentSearchLi);
    }
  }

  // Create a function to call and store the current weather data & append the weather for the city searched for the current day

  function renderWeather() {
    if (recentlySearchedCitiesArray[0] !== undefined) {
      // Store city searched in city array
      city = recentlySearchedCitiesArray[0];
      current.css("border", "1px solid #dee2e6!important");
    } else {
      // Clear currentWeatherDiv & exit function
      currentWeatherDiv.html("");
      current.css("box-shadow", "none");
      return;
    }

    // Create an AJAX call to retrieve current weather
    $.ajax({
      url: "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" +
        APIKey,
      method: "GET",
    }).then(function (response) {
      currentTemperature = Math.floor(response.main.temp);
      currentIcon = response.weather[0].icon;
      currentHumidity = response.main.humidity;
      currentWindSpeed = response.wind.speed;
      cityCoordLat = response.coord.lat;
      cityCoordLon = response.coord.lon;

      weatherTodayDiv.attr("class", "list-group today-ul");
      weatherDateDiv.attr("class", "list-group-item current title");
      weatherDateH2.text(city + " - " + currentDate);
      weatherImg.attr("src", "https://openweathermap.org/img/w/" + currentIcon + ".png");
      weatherTempDiv
        .attr("class", "list-group-item current temp")
        .text("Temperature: " + currentTemperature + " degrees celcius");
      weatherHumidityDiv
        .attr("class", "list-group-item current humidity")
        .text("Humidity: " + currentHumidity);
      weatherWindDiv
        .attr("class", "list-group-item current wind")
        .text("Wind Speed: " + currentWindSpeed);

      // Separate AJAX call to retrieve UV Index
      $.ajax({
        url:
          "https://api.openweathermap.org/data/2.5/uvi?lat=" +
          cityCoordLat +
          "&lon=" +
          cityCoordLon +
          "&appid=" +
          APIKey,
        method: "GET",
      }).then(function (response) {
        currentUvIndex = response.value;
        weatherUvIndexDiv
          .attr("class", "list-group-item current uv-index")
          .text("UV Index: ");
        weatherUvIndexDiv.append($("<span />", {
          class: "rounded rounded-uv",
          text: currentUvIndex
        }));
      });
    });

    currentWeatherDiv.append(weatherTodayDiv);
    weatherTodayDiv.append(weatherDateDiv);
    weatherDateDiv.append(weatherDateH2);
    weatherDateDiv.append(weatherImg);
    weatherTodayDiv.append(weatherTempDiv);
    weatherTodayDiv.append(weatherHumidityDiv);
    weatherTodayDiv.append(weatherWindDiv);
    weatherTodayDiv.append(weatherUvIndexDiv);
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
    renderWeather();
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

  $(document).on("submit", searchForm, function (event) {
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
    renderWeather();
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
});