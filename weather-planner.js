const cityWeather = [
  {
    id: "bien-hoa",
    city: "Biên Hòa",
    temperature: 32,
    condition: "Nắng nóng, trời quang",
    feelsLike: 35,
    humidity: 58,
    humidityNote: "Khá khô",
    wind: 10,
    windNote: "Gió nhẹ",
    icon: "sunny",
    itineraryForecast: [
      { temperature: 30, icon: "sunny" },
      { temperature: 32, icon: "sunny" },
      { temperature: 32, icon: "cloudy" },
      { temperature: 29, icon: "sunny" }
    ],
    tipTitle: "Trời nắng đẹp!",
    tipCopy: "Nhớ uống đủ nước và thoa kem chống nắng khi khám phá thành phố."
  },
  {
    id: "da-lat",
    city: "Đà Lạt",
    temperature: 22,
    condition: "Nắng nhẹ, trời trong",
    feelsLike: 24,
    humidity: 68,
    humidityNote: "Dễ chịu",
    wind: 8,
    windNote: "Gió nhẹ",
    icon: "sunny",
    itineraryForecast: [
      { temperature: 18, icon: "sunny" },
      { temperature: 21, icon: "sunny" },
      { temperature: 22, icon: "cloudy" },
      { temperature: 20, icon: "sunny" }
    ],
    tipTitle: "Thời tiết lý tưởng!",
    tipCopy: "Rất thích hợp để dạo quanh hồ và chụp ảnh ngoài trời."
  },
  {
    id: "vung-tau",
    city: "Vũng Tàu",
    temperature: 29,
    condition: "Mưa rào, trời nhiều mây",
    feelsLike: 33,
    humidity: 82,
    humidityNote: "Độ ẩm cao",
    wind: 16,
    windNote: "Gió vừa",
    icon: "rainy",
    itineraryForecast: [
      { temperature: 27, icon: "cloudy" },
      { temperature: 29, icon: "rainy" },
      { temperature: 29, icon: "rainy" },
      { temperature: 28, icon: "cloudy" }
    ],
    tipTitle: "Có thể có mưa!",
    tipCopy: "Bạn nên mang theo ô hoặc áo mưa khi ra ngoài nhé."
  }
];

const citySelect = document.querySelector("#city-select");
const themeSwitch = document.querySelector("#theme-switch");
const themeColorMeta = document.querySelector('meta[name="theme-color"]');
const itineraryForm = document.querySelector("#itinerary-form");
const placeNameInput = document.querySelector("#place-name");
const placeTimeInput = document.querySelector("#place-time");
const itineraryList = document.querySelector("#itinerary-list");
const itineraryCount = document.querySelector("#itinerary-count");
const temperatureValue = document.querySelector("#temperature-value");
const weatherCondition = document.querySelector("#weather-condition");
const feelsLikeValue = document.querySelector("#feels-like-value");
const humidityValue = document.querySelector("#humidity-value");
const humidityNote = document.querySelector("#humidity-note");
const windValue = document.querySelector("#wind-value");
const windNote = document.querySelector("#wind-note");
const weatherArt = document.querySelector(".sun-art");
const weatherTipTitle = document.querySelector("#weather-tip-title");
const weatherTipCopy = document.querySelector("#weather-tip-copy");
const welcomeCity = document.querySelector("#welcome-city");
const footerCity = document.querySelector("#footer-city");
const footerTemperature = document.querySelector("#footer-temperature");
const footerCondition = document.querySelector("#footer-condition");
const itineraryCity = document.querySelector("#itinerary-city");
const weatherSymbols = {
  sunny: "☀",
  cloudy: "☁",
  rainy: "☂"
};

function updateWeather(cityId) {
  const weather = cityWeather.find((city) => city.id === cityId);
  if (!weather) {
    throw new Error(`Không tìm thấy dữ liệu thời tiết cho thành phố "${cityId}".`);
  }

  temperatureValue.textContent = weather.temperature;
  weatherCondition.textContent = weather.condition;
  feelsLikeValue.textContent = `${weather.feelsLike}°`;
  humidityValue.textContent = weather.humidity;
  humidityNote.textContent = weather.humidityNote;
  windValue.textContent = weather.wind;
  windNote.textContent = weather.windNote;
  weatherArt.dataset.weather = weather.icon;
  weatherTipTitle.textContent = weather.tipTitle;
  weatherTipCopy.textContent = weather.tipCopy;
  welcomeCity.textContent = weather.city.toLocaleUpperCase("vi");
  footerCity.textContent = weather.city;
  footerTemperature.textContent = `${weather.temperature}°`;
  footerCondition.textContent = weather.condition;
  itineraryCity.textContent = weather.city.toLocaleUpperCase("vi");
  itineraryList.querySelectorAll("[data-custom-place] .place-info p").forEach((description) => {
    description.textContent = `Địa điểm tại ${weather.city}`;
  });
  itineraryList.querySelectorAll("[data-itinerary-weather]").forEach((item, index) => {
    const forecast = weather.itineraryForecast[index % weather.itineraryForecast.length];
    const symbol = item.querySelector(".weather-symbol");
    const temperature = item.querySelector(".itinerary-temperature");

    symbol.textContent = weatherSymbols[forecast.icon];
    symbol.dataset.weather = forecast.icon;
    temperature.textContent = `${forecast.temperature}°`;
    const condition = forecast.icon === "sunny" ? "trời nắng" : forecast.icon === "cloudy" ? "nhiều mây" : "có mưa";
    item.setAttribute("aria-label", `${weather.city}: ${forecast.temperature} độ, ${condition}`);
  });
}

function formatTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, minutes, 0, 0);
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true
  }).format(date);
}

function updateItineraryCount() {
  itineraryCount.textContent = String(itineraryList.children.length).padStart(2, "0");
}

function createItineraryItem(name, time) {
  const item = document.createElement("li");
  item.className = "itinerary-item is-entering";
  item.dataset.customPlace = "true";

  const timeElement = document.createElement("time");
  timeElement.dateTime = time;
  timeElement.textContent = formatTime(time);

  const marker = document.createElement("span");
  marker.className = "timeline-marker marker-custom";
  marker.setAttribute("aria-hidden", "true");
  marker.innerHTML = '<svg viewBox="0 0 24 24" fill="none"><path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0Z" stroke="currentColor" stroke-width="1.6"/><circle cx="12" cy="10" r="2.3" stroke="currentColor" stroke-width="1.6"/></svg>';

  const info = document.createElement("div");
  info.className = "place-info";

  const title = document.createElement("h3");
  title.textContent = name;

  const description = document.createElement("p");
  description.textContent = `Địa điểm tại ${cityWeather.find((city) => city.id === citySelect.value).city}`;

  const actions = document.createElement("div");
  actions.className = "place-actions";

  const visitButton = document.createElement("button");
  visitButton.className = "visit-button";
  visitButton.type = "button";
  visitButton.dataset.action = "visit";
  visitButton.setAttribute("aria-pressed", "false");
  visitButton.textContent = "Đã đến";

  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.dataset.action = "delete";
  deleteButton.textContent = "Xóa";

  actions.append(visitButton, deleteButton);
  info.append(title, description, actions);

  const weather = document.createElement("span");
  weather.className = "place-weather";
  weather.dataset.itineraryWeather = "";
  weather.setAttribute("aria-label", "Dự báo thời tiết cho địa điểm");

  const symbol = document.createElement("span");
  symbol.className = "weather-symbol";
  symbol.setAttribute("aria-hidden", "true");

  const temperature = document.createElement("span");
  temperature.className = "itinerary-temperature";
  weather.append(symbol, document.createTextNode(" "), temperature);

  item.append(timeElement, marker, info, weather);
  return item;
}

itineraryForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const name = placeNameInput.value.trim();
  const time = placeTimeInput.value;
  placeNameInput.setCustomValidity(name ? "" : "Vui lòng nhập tên địa điểm.");

  if (!itineraryForm.reportValidity()) {
    return;
  }

  const item = createItineraryItem(name, time);
  const nextItem = [...itineraryList.children].find((existingItem) => {
    const existingTime = existingItem.querySelector("time").dateTime.split("T").pop().slice(0, 5);
    return existingTime > time;
  });
  itineraryList.insertBefore(item, nextItem || null);
  placeNameInput.value = "";
  updateWeather(citySelect.value);
  updateItineraryCount();

  window.setTimeout(() => {
    item.classList.remove("is-entering");
  }, 380);
  placeNameInput.focus();
});

itineraryList.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-action]");
  if (!button) {
    return;
  }

  const item = button.closest(".itinerary-item");
  if (button.dataset.action === "visit") {
    const isVisited = button.getAttribute("aria-pressed") !== "true";
    button.setAttribute("aria-pressed", String(isVisited));
    button.textContent = isVisited ? "Đã đến ✓" : "Đã đến";
    item.classList.toggle("is-visited", isVisited);
    return;
  }

  if (button.dataset.action === "delete") {
    item.classList.add("is-removing");
    window.setTimeout(() => {
      item.remove();
      updateItineraryCount();
    }, 220);
  }
});

citySelect.addEventListener("change", () => {
  updateWeather(citySelect.value);
});

themeSwitch.addEventListener("click", () => {
  const isDarkMode = document.documentElement.dataset.theme === "dark";
  const nextTheme = isDarkMode ? "light" : "dark";
  document.documentElement.dataset.theme = nextTheme;
  themeColorMeta.content = nextTheme === "dark" ? "#26383d" : "#e8eee6";
  themeSwitch.setAttribute("aria-checked", String(nextTheme === "dark"));
  themeSwitch.setAttribute("aria-label", `Chuyển sang ${nextTheme === "dark" ? "Light" : "Dark"} Mode`);
  themeSwitch.querySelector(".theme-label").textContent = nextTheme === "dark" ? "Dark" : "Light";
});

updateWeather(citySelect.value);
updateItineraryCount();
