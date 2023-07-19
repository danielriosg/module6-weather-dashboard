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