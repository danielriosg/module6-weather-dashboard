$(document).ready(function () {
  var searchHistory = [];

  // Retrieve search history from localStorage
  if (localStorage.getItem("searchHistory")) {
    searchHistory = JSON.parse(localStorage.getItem("searchHistory"));
    displaySearchHistory();
  }

  $("#search-form").submit(function (event) {
    event.preventDefault();
    var city = $("#city-input").val();
    searchWeather(city);
  });

  $(document).on("click", ".searched-city", function () {
    var city = $(this).text();
    searchWeather(city);
  });
  function searchWeather(city) {
    // Get the current weather data for the city
    $.getJSON(
      "https://api.openweathermap.org/data/2.5/weather?q=" +
        city +
        "&units=imperial&appid=6eef3ee62896cf65b9d37eec55ae4b69",
      function (currentData) {
        // Capitalize the first letter of the city name
        var capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);


        // Get the current date
        var currentDate = new Date();
        var formattedDate = currentDate.toLocaleDateString(undefined, {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        // Get the weather icon code
        var iconCode = currentData.weather[0].icon;

        // Get the weather description
        var description = currentData.weather[0].description;

        // Display the current weather information
        $("#current-info").html(
          "<h3>" +
            capitalizedCity +
            "</h3>" +
            "<p>Date: " +
            formattedDate +
            "</p>" +
            "<p>Temperature: " +
            currentData.main.temp +
            "°F</p>" +
            "<p>Humidity: " +
            currentData.main.humidity +
            "%</p>" +
            "<p>Wind Speed: " +
            currentData.wind.speed +
            " MPH</p>" +
            "<p>Description: " +
            description +
            "</p>" +
            "<i class='fas fa-fw fa-2x weather-icon'></i>"
        );

        // Set the weather icon
        $(".weather-icon")
          .addClass("wi")
          .addClass("wi-owm-" + iconCode);

          // Get the 5-day forecast data for the city
        $.getJSON(
          "https://api.openweathermap.org/data/2.5/forecast?q=" +
            city +
            "&units=imperial&appid=6eef3ee62896cf65b9d37eec55ae4b69",
          function (forecastData) {
            // Group forecast data by date
            var forecastByDate = {};

            for (var i = 0; i < forecastData.list.length; i++) {
              var forecast = forecastData.list[i];
              var date = forecast.dt_txt.split(" ")[0];

              if (!forecastByDate[date]) {
                forecastByDate[date] = [];
              }

              forecastByDate[date].push(forecast);
            }
// Display the 5-day forecast
            var forecastInfo = "";

            for (var date in forecastByDate) {
              var forecasts = forecastByDate[date];

              var temperatureSum = 0;
              var humiditySum = 0;
              var windSpeedSum = 0;
              var description = "";

              for (var j = 0; j < forecasts.length; j++) {
                var forecast = forecasts[j];
                temperatureSum += forecast.main.temp;
                humiditySum += forecast.main.humidity;
                windSpeedSum += forecast.wind.speed;
                description = forecast.weather[0].description;
              }

              var averageTemperature = temperatureSum / forecasts.length;
              var averageHumidity = humiditySum / forecasts.length;
              var averageWindSpeed = windSpeedSum / forecasts.length;

              forecastInfo +=
                "<div class='forecast-block'>" +
                "<h4>" +
                date +
                "</h4>" +
                "<p>Temperature: " +
                averageTemperature.toFixed(2) +
                "°F</p>" +
                "<p>Humidity: " +
                averageHumidity.toFixed(2) +
                "%</p>" +
                "<p>Wind Speed: " +
                averageWindSpeed.toFixed(2) +
                " MPH</p>" +
                "<p>Description: " +
                description +
                "</p>" +
                "</div>";
            }

            $("#forecast-info").html(forecastInfo);
          }
        );
