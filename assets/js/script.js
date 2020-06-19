$(document).ready(function () {
  // HTML variables from index.html & dynamically created

  var leftColumn = $(".col-sm-3");
  var searchForm = $("#search-form");
  var searchText = $("#input-text");
  var searchedCities = $("#search-ul");
  var buttonDiv = $(".button-div");
  var currentWeatherDiv = $(".rounded");
  var weatherTodayDiv = $("<div>");
  var weatherDateDiv = $("<div>");
  var weatherDateH2 = $("<h2>");
  var weatherImg = $("<img>");
  var weatherTempDiv = $("<div>");
  var weatherHumidityDiv = $("<div>");
  var weatherWindDiv = $("<div>");
  var weatherUvIndexDiv = $("<div>");
  var weatherUvIndexSpan = $("<span>");
  var forecastHeading = $("#forecast-heading");
  var forecastRow = $(".forecast-row");

  // Empty Array variables

  var recentlySearchedCitiesArray = [];
  var city = [];

  // OpenWeatherMap API Key
  var APIKey = "a9bd055528b6c2f7e0ed40218ab0ce62";

  // moment.js current date
  var currentDate = moment().format("dddd, MMMM Do");

  // Loads the app
  init();

  // Function to append recently searched cities to the search box in the left column

  function renderSearchHistory() {
    if (recentlySearchedCitiesArray.length !== 0) {
      // Clear searchedCities element & set background color to light grey
      searchedCities.html("");
      leftColumn.css("background-color", "rgb(247, 247, 247)");
    } else {
      // Clear searchedCities element, exit function & set background color to white
      searchedCities.html("");
      buttonDiv.hide();
      leftColumn.css("background-color", "rgb(255, 255, 255)");
      return;
    }

    // Show buttons to select recently search city
    buttonDiv.show();

    // Reverse recentlySearchedCitiesArray
    recentlySearchedCitiesArray.reverse();

    // Render a new li & button for each city searched with a maximum of only 8 to appear at any given time
    for (var i = 0; i < Math.min(8, recentlySearchedCitiesArray.length); i++) {
      city = recentlySearchedCitiesArray[i];

      var recentSearchLi = $("<li>")
        .attr("class", "list-group-item")
        .data("index", i);
      var recentSearchButton = $("<button>")
        .attr("class", "btn btn-light")
        .attr("type", "button")
        .text(city)
        .css("background-color", "rgb(255, 255, 255)");

      searchedCities.append(recentSearchLi);
      recentSearchLi.append(recentSearchButton);
    }
  }

  // Function to clear the recent search history
  function clearSearchHistory() {
    // Hide the buttons attached to each city li
    buttonDiv.hide();

    // Clear the array storing the searched cities
    recentlySearchedCitiesArray = [];

    // Clearing the searched cities
    searchedCities.html("");

    // Clear localStorage
    localStorage.clear();
  }

  // Function to call and store the current weather data & append the weather for the city searched for the current day

  function renderWeather() {
    if (recentlySearchedCitiesArray[0] !== undefined) {
      // Store city searched in city array
      city = recentlySearchedCitiesArray[0];
    } else {
      // Clear currentWeatherDiv & exit function
      currentWeatherDiv.html("");
      return;
    }

    // Create an AJAX call to retrieve current weather
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=metric&appid=" +
        APIKey,
      method: "GET",
    }).then(function (response) {
      // Storing data from the object returned by the AJAX API call
      cityID = response.id;
      currentTemperature = Math.floor(response.main.temp);
      currentIcon = response.weather[0].icon;
      currentHumidity = response.main.humidity;
      currentWindSpeed = response.wind.speed;
      cityCoordLat = response.coord.lat;
      cityCoordLon = response.coord.lon;

      // Adding classes and text to each HTML element when rendered
      weatherTodayDiv.attr("class", "list-group today-ul");
      weatherDateDiv.attr("class", "list-group-item current title");
      weatherDateH2.text(city + " - " + currentDate);
      weatherImg.attr(
        "src",
        "https://openweathermap.org/img/w/" + currentIcon + ".png"
      );
      weatherTempDiv
        .attr("class", "list-group-item current temp")
        .text("Temperature: " + currentTemperature + " degrees celsius");
      weatherHumidityDiv
        .attr("class", "list-group-item current humidity")
        .text("Humidity: " + currentHumidity + "%");
      weatherWindDiv
        .attr("class", "list-group-item current wind")
        .text("Wind Speed: " + currentWindSpeed + " kmph");

      // Separate AJAX call to retrieve UV Index, adding classes and text to each HTML element when rendered
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
        weatherUvIndexDiv.append(
          weatherUvIndexSpan
            .attr("class", "rounded rounded-uv")
            .text(currentUvIndex)
        );
        setUvIndexBackgroundColor(currentUvIndex);
      });
    });

    // Append the HTML elements
    currentWeatherDiv.append(weatherTodayDiv);
    weatherTodayDiv.append(weatherDateDiv);
    weatherDateDiv.append(weatherDateH2);
    weatherDateDiv.append(weatherImg);
    weatherTodayDiv.append(weatherTempDiv);
    weatherTodayDiv.append(weatherHumidityDiv);
    weatherTodayDiv.append(weatherWindDiv);
    weatherTodayDiv.append(weatherUvIndexDiv);
  }

  // Function to set the relevant background color for the UV Index based on UV Index returned
  function setUvIndexBackgroundColor(uvIndex) {
    if (uvIndex <= 2) {
      return weatherUvIndexSpan.css("background-color", "green");
    } else if (uvIndex > 2 && uvIndex <= 5) {
      return weatherUvIndexSpan.css("background-color", "yellow");
    } else if (uvIndex > 5 && uvIndex <= 7) {
      return weatherUvIndexSpan.css("background-color", "orange");
    } else if (uvIndex > 7 && uvIndex <= 10) {
      return weatherUvIndexSpan.css("background-color", "red");
    } else {
      return weatherUvIndexSpan.css("background-color", "purple");
    }
  }

  // Function to append the 5 day forecast for the city searched

  function renderFiveDayForecast() {
    if (recentlySearchedCitiesArray[0] !== undefined) {
      forecastHeading.text("5-Day Forecast");
    } else {
      forecastHeading.html = "";
      return;
    }

    // Create an AJAX call to retrieve current weather
    $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        city +
        "&units=metric&appid=" +
        APIKey,
      method: "GET",
    }).then(function (response) {
      listIndex = response.list;
      forecastRow.empty();

      // API data returned in 3 hour blocks -> For every 7th index, it will be the next day. Render the weather data for that day.
      listIndex.forEach(function (item, index) {
        if (index % 7 === 0 && index !== 0) {
          forecastDiv = $("<div>").attr(
            "class",
            "col-sm-2.4 rounded border forecast-day"
          );
          forecastTodayDiv = $("<div>").attr("class", "list-group today-ul");
          forecastDateDiv = $("<div>").attr("class", "forecast-date-div");
          forecastTempDiv = $("<div>").attr("class", "forecast-temp-div");
          forecastHumidityDiv = $("<div>").attr(
            "class",
            "forecast-humidity-div"
          );
          forecastH4 = $("<h4>").html(setDate(index));
          forecastImg = $("<img>").attr(
            "src",
            "https://openweathermap.org/img/w/" + item.weather[0].icon + ".png"
          );
          forecastSpanTemp = $("<span>")
            .attr("class", "temp")
            .html("Temp: " + Math.round(item.main.temp) + " degrees");
          forecastSpanHumidity = $("<span>")
            .attr("class", "humidity")
            .html("Humidity: " + item.main.humidity + "%");

          forecastRow.append(forecastDiv);
          forecastDiv.append(forecastTodayDiv);
          forecastTodayDiv.append(forecastDateDiv);
          forecastDateDiv.append(forecastH4);
          forecastDateDiv.append(forecastImg);
          forecastTodayDiv.append(forecastTempDiv);
          forecastTempDiv.append(forecastSpanTemp);
          forecastTodayDiv.append(forecastHumidityDiv);
          forecastHumidityDiv.append(forecastSpanHumidity);
        }
      });
    });
  }

  // Function to set the date for each day of the 5-Day forecast
  function setDate(index) {
    if (index === 7) {
      var dateOne = moment().add(1, "days").format("MMMM Do");
      return dateOne;
    } else if (index === 14) {
      var dateTwo = moment().add(2, "days").format("MMMM Do");
      return dateTwo;
    } else if (index === 21) {
      var dateTwo = moment().add(3, "days").format("MMMM Do");
      return dateTwo;
    } else if (index === 28) {
      var dateTwo = moment().add(4, "days").format("MMMM Do");
      return dateTwo;
    } else if (index === 35) {
      var dateTwo = moment().add(5, "days").format("MMMM Do");
      return dateTwo;
    }
  }

  // Function to initialize (init) the app

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
    renderFiveDayForecast();
  }

  // Function to locally store the search cities

  function locallyStoreSearchedCities() {
    // Stringify and set "cities" key in localStorage to recentlySearchedCitiesArray
    localStorage.setItem("cities", JSON.stringify(recentlySearchedCitiesArray));
  }

  // Event Listeners

  // Click event for the city search box
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
    renderFiveDayForecast();
  });

  // Function to add a click event to each button attached to the recently searched cities li. This is attached to the body as the event handler is not removed on re-rendering of the weather sections.
  $("body").on("click", ".btn-light", function (event) {
    event.preventDefault();

    // Store the html from the button
    var cityTextArray = $(this).html().trim();

    // Add new cityText to recentlySearchedCitiesArray
    recentlySearchedCitiesArray.push(cityTextArray);

    // Store updated recentlySearchedCitiesArray in localStorage, re-render the list
    locallyStoreSearchedCities();
    renderSearchHistory();
    renderWeather();
    renderFiveDayForecast();
  });

  // Click event for clear button
  $("body").on("click", ".clear", function (event) {
    event.preventDefault();

    clearSearchHistory();
  });
});
