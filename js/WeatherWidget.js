import { UIComponent } from './UIComponent.js';

export class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Погода в Москве',
            type: 'weather'
        });
        
        this.weatherData = config.weatherData || this.generateWeatherData();
    }

    generateWeatherData() {
        const temperatures = [-5, -2, 0, 2, 5, 8, 12, 15, 10, 7, 3, -1];
        const conditions = ['ясно', 'переменная облачность', 'пасмурно', 'небольшой дождь', 'снег'];
        const windSpeeds = [2, 3, 4, 5, 6, 7];
        
        const randomTemp = temperatures[Math.floor(Math.random() * temperatures.length)];
        const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
        const randomWind = windSpeeds[Math.floor(Math.random() * windSpeeds.length)];
        const randomHumidity = Math.floor(Math.random() * 40) + 50;
        
        return {
            temperature: randomTemp,
            condition: randomCondition,
            wind: randomWind,
            humidity: randomHumidity,
            feelsLike: randomTemp - Math.floor(Math.random() * 3)
        };
    }

    renderContent() {
        return `
            <div class="weather-container">
                <div class="weather-main">
                    <div class="weather-temp">${this.weatherData.temperature}°C</div>
                    <div class="weather-description">${this.weatherData.condition}</div>
                </div>
                <div class="weather-details">
                    <div class="weather-detail">
                        <span>Ощущается как:</span>
                        <span>${this.weatherData.feelsLike}°C</span>
                    </div>
                    <div class="weather-detail">
                        <span>Влажность:</span>
                        <span>${this.weatherData.humidity}%</span>
                    </div>
                    <div class="weather-detail">
                        <span>Ветер:</span>
                        <span>${this.weatherData.wind} м/с</span>
                    </div>
                </div>
                <button class="refresh-weather-btn">Обновить погоду</button>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const refreshBtn = this.element.querySelector('.refresh-weather-btn');
        refreshBtn.addEventListener('click', () => this.updateWeather());
    }

    updateWeather() {
        this.weatherData = this.generateWeatherData();
        this.updateUI();
        
        if (typeof this.onStateChange === 'function') {
            this.onStateChange();
        }
    }

    updateUI() {
        const weatherMain = this.element.querySelector('.weather-main');
        const weatherDetails = this.element.querySelector('.weather-details');
        
        if (weatherMain) {
            weatherMain.innerHTML = `
                <div class="weather-temp">${this.weatherData.temperature}°C</div>
                <div class="weather-description">${this.weatherData.condition}</div>
            `;
        }
        
        if (weatherDetails) {
            weatherDetails.innerHTML = `
                <div class="weather-detail">
                    <span>Ощущается как:</span>
                    <span>${this.weatherData.feelsLike}°C</span>
                </div>
                <div class="weather-detail">
                    <span>Влажность:</span>
                    <span>${this.weatherData.humidity}%</span>
                </div>
                <div class="weather-detail">
                    <span>Ветер:</span>
                    <span>${this.weatherData.wind} м/с</span>
                </div>
            `;
        }
    }
}