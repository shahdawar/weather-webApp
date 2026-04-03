const apiKey = "4776235e9cde86928755f8dfbe2fcd7d";

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("seachBtn");
const weatherCard = document.getElementById("weatherCard");

const city = document.getElementById("city");
const country = document.getElementById("country");
const temp = document.getElementById("temp");
const feels = document.getElementById("feels");
const condition = document.getElementById("condition");

const wind = document.getElementById("wind");
const humidity = document.getElementById("humidity");
const visibility = document.getElementById("visibility");
const pressure = document.getElementById("pressure");

function setCardLoading(isLoading) {
  weatherCard.classList.toggle("is-loading", isLoading);
}

async function getWeatherByCity(cityName, showLoader = false) {
  if (showLoader) {
    setCardLoading(true);
  }

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`,
    );
    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found!");
      return;
    }

    updateUI(data);
  } catch (error) {
    console.log(error);
  } finally {
    if (showLoader) {
      setCardLoading(false);
    }
  }
}

async function getWeatherByCoords(lat, lon) {
  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`,
    );
    const data = await res.json();

    updateUI(data);
  } catch (error) {
    console.log(error);
  }
}

function updateUI(data) {
  city.innerText = data.name;
  country.innerText = data.sys.country;

  temp.innerText = Math.round(data.main.temp);
  feels.innerText = `Feels like ${Math.round(data.main.feels_like)}°C`;
  condition.innerText = data.weather[0].main;

  wind.innerText = `${data.wind.speed} km/h`;
  humidity.innerText = `${data.main.humidity}%`;
  visibility.innerText = `${data.visibility / 1000} km`;
  pressure.innerText = `${data.main.pressure} mb`;
}

searchBtn.addEventListener("click", () => {
  const cityName = searchInput.value.trim();
  if (cityName !== "") {
    getWeatherByCity(cityName, true);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const cityName = searchInput.value.trim();
    if (cityName !== "") {
      getWeatherByCity(cityName, true);
    }
  }
});

navigator.geolocation.getCurrentPosition(
  (position) => {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;

    getWeatherByCoords(lat, lon);
  },
  () => {
    getWeatherByCity("Peshawar");
  },
);
