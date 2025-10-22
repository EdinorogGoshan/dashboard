import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Погода',
            type: 'weather'
        });
        this.city = config.city || 'Москва';
        this.weatherData = null;
    }

    renderContent() {
        return `
            <div class="weather-container">
                <div class="weather-input">
                    <input type="text" value="${this.city}" placeholder="Введите город" class="weather-city-input">
                    <button class="weather-search-btn">Поиск</button>
                </div>
                <div class="weather-info">
                    ${this.weatherData ? this.renderWeather() : '<p>Загрузка...</p>'}
                </div>
            </div>
        `;
    }

    renderWeather() {
        if (!this.weatherData) return '<p>Данные о погоде не загружены</p>';
        
        return `
            <div class="weather-main">
                <div class="weather-temp">${Math.round(this.weatherData.main.temp)}°C</div>
                <div class="weather-description">${this.weatherData.weather[0].description}</div>
            </div>
            <div class="weather-details">
                <div class="weather-detail">
                    <span>Ощущается как:</span>
                    <span>${Math.round(this.weatherData.main.feels_like)}°C</span>
                </div>
                <div class="weather-detail">
                    <span>Влажность:</span>
                    <span>${this.weatherData.main.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <span>Ветер:</span>
                    <span>${this.weatherData.wind.speed} м/с</span>
                </div>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const searchBtn = this.element.querySelector('.weather-search-btn');
        const cityInput = this.element.querySelector('.weather-city-input');
        
        searchBtn.addEventListener('click', () => this.searchWeather());
        cityInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.searchWeather();
        });
        
        // Загружаем погоду при создании виджета
        this.fetchWeather();
    }

    searchWeather() {
        const cityInput = this.element.querySelector('.weather-city-input');
        const city = cityInput.value.trim();
        
        if (city) {
            this.city = city;
            this.fetchWeather();
        }
    }

async fetchWeather() {
    try {
        // Используем бесплатный API погоды (может иметь ограничения)
        // Альтернативный API - можно использовать любой работающий
        const response = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current_weather=true&timezone=auto`
        );
        
        if (!response.ok) {
            throw new Error('Ошибка загрузки погоды');
        }
        
        const data = await response.json();
        
        // Форматируем данные для отображения
        this.weatherData = {
            main: {
                temp: data.current_weather.temperature,
                feels_like: data.current_weather.temperature,
                humidity: 65 // Примерное значение
            },
            weather: [{
                description: this.getWeatherDescription(data.current_weather.weathercode)
            }],
            wind: {
                speed: data.current_weather.windspeed
            }
        };
        
        this.updateUI();
    } catch (error) {
        console.error('Ошибка при загрузке погоды:', error);
        this.weatherData = null;
        this.updateUIWithError('Не удалось загрузить погоду');
    }
}

getWeatherDescription(code) {
    const weatherCodes = {
        0: 'ясно',
        1: 'преимущественно ясно',
        2: 'переменная облачность',
        3: 'пасмурно',
        45: 'туман',
        48: 'туман',
        51: 'легкая морось',
        53: 'морось',
        55: 'сильная морось',
        61: 'небольшой дождь',
        63: 'дождь',
        65: 'сильный дождь',
        80: 'ливень',
        81: 'сильный ливень',
        82: 'очень сильный ливень'
    };
    return weatherCodes[code] || 'неизвестно';
}
}