function savedCityList(citySearchList) {
    $("#start-cityList").empty();

    var keys = Object.keys(citySearchList);
    for (var i = 0; i < keys.length; i++) {
        var cityListHistory = $("<button>");
        cityListHistory.addClass("list-group-item list-group-item-action");

        var Str = keys[i].toLowerCase().split(" ");
        for (var x = 0; x < Str.length; x++) {
            Str[x] =
                Str[x].charAt(0).toUpperCase() + Str[x].substring(1);
        }
        var titleCasedCity = Str.join(" ");
        cityListHistory.text(titleCasedCity);

        $("#start-cityList").append(cityListHistory);
    }
}

function currentCityWeather(city, citySearchList) {
    savedCityList(citySearchList);
    // current weather
    var queryURL =
        "https://api.openweathermap.org/data/2.5/weather?&units=imperial&appid=0a9ce3613f50f168aeadcb2242208a27&q=" +
        city;
    //  5 day forcast
    var queryURL2 =
        "https://api.openweathermap.org/data/2.5/forecast?&units=imperial&appid=0a9ce3613f50f168aeadcb2242208a27&q=" +
        city;

    var latitude;

    var longitude;

    $.ajax({
        url: queryURL,
        method: "GET"
    })
        // Store data 
        .then(function (weather) {

            console.log(queryURL);


            console.log(weather);

            var nowMoment = moment();

            var displayMoment = $("<h3>");
            $("#city-name").empty();
            $("#city-name").append(
                displayMoment.text("(" + nowMoment.format("M/D/YYYY") + ")")
            );

            var locationName = $("<h3>").text(weather.name);
            $("#city-name").prepend(locationName);

            var weatherIcon = $("<img>");
            weatherIcon.attr(
                "src",
                "https://openweathermap.org/img/w/" + weather.weather[0].icon + ".png"
            );
            $("#current-icon").empty();
            $("#current-icon").append(weatherIcon);

            $("#current-temp").text("Temperature: " + weather.main.temp + " °F");
            $("#current-humidity").text("Humidity: " + weather.main.humidity + "%");
            $("#current-wind").text("Wind Speed: " + weather.wind.speed + " MPH");

            latitude = weather.coord.lat;
            longitude = weather.coord.lon;

            var queryURL3 =
                "https://api.openweathermap.org/data/2.5/uvi/forecast?&units=imperial&appid=0a9ce3613f50f168aeadcb2242208a27&q=" +
                "&lat=" +
                latitude +
                "&lon=" +
                longitude;

            $.ajax({
                url: queryURL3,
                method: "GET"

            }).then(function (uvIndex) {
                console.log(uvIndex);

                var uvIndexDisplay = $("<button>");
                uvIndexDisplay.addClass("btn btn-danger");

                $("#current-uv").text("UV Index: ");
                $("#current-uv").append(uvIndexDisplay.text(uvIndex[0].value));
                console.log(uvIndex[0].value);

                $.ajax({
                    url: queryURL2,
                    method: "GET"

                }).then(function (forecast) {
                    console.log(queryURL2);

                    console.log(forecast);
                    for (var i = 6; i < forecast.list.length; i += 8) {

                        var forecastDate = $("<h5>");
                        var forecastPosition = (i + 2) / 8;

                        console.log("#forecast-date" + forecastPosition);

                        $("#forecast-date" + forecastPosition).empty();
                        $("#forecast-date" + forecastPosition).append(
                            forecastDate.text(nowMoment.add(1, "days").format("M/D/YYYY"))
                        );

                        var forecastIcon = $("<img>");
                        forecastIcon.attr(
                            "src",
                            "https://openweathermap.org/img/w/" +
                            forecast.list[i].weather[0].icon +
                            ".png"
                        );

                        $("#forecast-icon" + forecastPosition).empty();
                        $("#forecast-icon" + forecastPosition).append(forecastIcon);

                        console.log(forecast.list[i].weather[0].icon);

                        $("#forecast-temp" + forecastPosition).text(
                            "Temp: " + forecast.list[i].main.temp + " °F"
                        );
                        $("#forecast-humidity" + forecastPosition).text(
                            "Humidity: " + forecast.list[i].main.humidity + "%"
                        );

                    }
                });
            });
        });
}

$(document).ready(function () {
    var citySearchList;
    var citySearchListStr = localStorage.getItem("citySearchList");
    if (citySearchListStr) {
        citySearchList = JSON.parse(citySearchListStr);
        console.log('im looking here', citySearchList)
    } else {
        citySearchList = {};
    }


    savedCityList(citySearchList);
    $("#current-weather").hide();
    $("#forecast-weather").hide();



    $("#search-button").on("click", function (event) {
        event.preventDefault();
        var city = $("#city-input")
            .val()
            .trim()
            .toLowerCase();

        if (city != "") {
            // example idea for refactor
            // cityListArray.push(city)
            // localStorage.setItem("citySearchList", cityListArray)

            citySearchList[city] = true;
            localStorage.setItem("citySearchList", JSON.stringify(citySearchList));
            currentCityWeather(city, citySearchList);
            $("#current-weather").show();
            $("#forecast-weather").show();
        }


    });

    $("#start-cityList").on("click", "button", function (event) {
        event.preventDefault();
        var city = $(this).text();

        currentCityWeather(city, citySearchList);
        $("#current-weather").show();
        $("#forecast-weather").show();
    });
});