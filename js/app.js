document.addEventListener('DOMContentLoaded', () => {
  const cityInput = document.getElementById('cityInput');
  const searchBtn = document.getElementById('searchBtn');
  const removeBtn = document.getElementById('removeBtn');
  const errorMessage = document.getElementById('errorMessage');
  const successMessage = document.getElementById('successMessage');
  const weatherResults = document.getElementById('weatherResults');
  const apiKey = '670136ad5ad30110658736etp5594fa';

  function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.add('show');
    setTimeout(() => {
      errorMessage.classList.remove('show');
    }, 3000);
  }

  function getWeatherData(city) {
    const geocodeUrl = `https://geocode.maps.co/search?q=${city}&api_key=${apiKey}`;
    fetch(geocodeUrl)
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          const { lat, lon, display_name } = data[0];
          const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`;
          fetch(weatherUrl)
            .then((response) => response.json())
            .then((weatherData) => {
              const temperature = weatherData.current_weather.temperature;
              const windSpeed = weatherData.current_weather.windspeed;
              displayWeatherData(
                display_name,
                lat,
                lon,
                temperature,
                windSpeed
              );
            })
            .catch(() => showError('Error fetching weather data.'));
        } else {
          showError('City not found.');
        }
      })
      .catch(() => showError('Error fetching geocode data.'));
  }

  function displayWeatherData(city, lat, lon, temperature, windSpeed) {
    weatherResults.innerHTML = `
          <div class="weather-card">
              <h3>${city}</h3>
              <p class="label">Latitude: <span>${lat}</span></p>
              <p class="label">Longitude: <span>${lon}</span></p>
              <p class="label">Temperature: <span>${temperature} °C</span></p>
              <p class="label">Wind Speed: <span>${windSpeed} km/h</span></p>
          </div>
      `;
    weatherResults.style.display = 'block';
    removeBtn.style.display = 'block';
    localStorage.setItem('city', city);
  }

  function loadCityFromLocalStorage() {
    const city = localStorage.getItem('city');
    if (city) {
      cityInput.value = city;
      getWeatherData(city);
    }
  }

  searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
      getWeatherData(city);
      cityInput.value = '';
    } else {
      showError('Please enter a city name.');
    }
  });

  removeBtn.addEventListener('click', () => {
    weatherResults.style.display = 'none';
    removeBtn.style.display = 'none';
    localStorage.removeItem('city');
    cityInput.value = '';
  });

  loadCityFromLocalStorage();
});
