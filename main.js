// Главный файл приложения
class UIComponent {
    constructor(config = {}) {
        this.id = config.id || `widget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        this.title = config.title || 'Виджет';
        this.type = config.type || 'base';
        this.isMinimized = false;
        this.element = null;
    }

    render() {
        const widgetElement = document.createElement('div');
        widgetElement.className = 'widget';
        widgetElement.id = this.id;
        widgetElement.dataset.type = this.type;
        
        widgetElement.innerHTML = `
            <div class="widget-header">
                <h3>${this.title}</h3>
                <div class="widget-controls">
                    <button class="minimize-btn">−</button>
                    <button class="close-btn">×</button>
                </div>
            </div>
            <div class="widget-content">
                ${this.renderContent()}
            </div>
        `;
        
        this.element = widgetElement;
        this.bindEvents();
        return widgetElement;
    }

    renderContent() {
        return '<p>Базовый виджет</p>';
    }

    bindEvents() {
        if (!this.element) return;
        
        const minimizeBtn = this.element.querySelector('.minimize-btn');
        const closeBtn = this.element.querySelector('.close-btn');
        
        minimizeBtn.addEventListener('click', () => this.toggleMinimize());
        closeBtn.addEventListener('click', () => this.destroy());
    }

    toggleMinimize() {
        this.isMinimized = !this.isMinimized;
        const content = this.element.querySelector('.widget-content');
        
        if (this.isMinimized) {
            content.style.display = 'none';
        } else {
            content.style.display = 'block';
        }
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
    }
}

class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Список дел',
            type: 'todo'
        });
        this.tasks = config.tasks || [];
    }

    renderContent() {
        return `
            <div class="todo-container">
                <div class="todo-input">
                    <input type="text" placeholder="Новая задача..." class="todo-input-field">
                    <button class="add-todo-btn">Добавить</button>
                </div>
                <ul class="todo-list">
                    ${this.tasks.map(task => `
                        <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                            <input type="checkbox" ${task.completed ? 'checked' : ''} class="todo-checkbox">
                            <span class="todo-text">${task.text}</span>
                            <button class="delete-todo-btn">×</button>
                        </li>
                    `).join('')}
                </ul>
                <div class="todo-stats">
                    Всего: ${this.tasks.length} | Выполнено: ${this.tasks.filter(t => t.completed).length}
                </div>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const addBtn = this.element.querySelector('.add-todo-btn');
        const inputField = this.element.querySelector('.todo-input-field');
        const todoList = this.element.querySelector('.todo-list');
        
        addBtn.addEventListener('click', () => this.addTask());
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        todoList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-todo-btn')) {
                this.deleteTask(e.target.closest('.todo-item').dataset.id);
            } else if (e.target.classList.contains('todo-checkbox')) {
                this.toggleTask(e.target.closest('.todo-item').dataset.id);
            }
        });
    }

    addTask() {
        const inputField = this.element.querySelector('.todo-input-field');
        const text = inputField.value.trim();
        
        if (text) {
            const newTask = {
                id: Date.now().toString(),
                text: text,
                completed: false
            };
            
            this.tasks.push(newTask);
            this.updateUI();
            inputField.value = '';
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(task => task.id !== id);
        this.updateUI();
    }

    toggleTask(id) {
        const task = this.tasks.find(task => task.id === id);
        if (task) {
            task.completed = !task.completed;
            this.updateUI();
        }
    }

    updateUI() {
        const todoList = this.element.querySelector('.todo-list');
        const stats = this.element.querySelector('.todo-stats');
        
        if (todoList) {
            todoList.innerHTML = this.tasks.map(task => `
                <li class="todo-item ${task.completed ? 'completed' : ''}" data-id="${task.id}">
                    <input type="checkbox" ${task.completed ? 'checked' : ''} class="todo-checkbox">
                    <span class="todo-text">${task.text}</span>
                    <button class="delete-todo-btn">×</button>
                </li>
            `).join('');
        }
        
        if (stats) {
            stats.textContent = `Всего: ${this.tasks.length} | Выполнено: ${this.tasks.filter(t => t.completed).length}`;
        }
    }
}

class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Случайная цитата',
            type: 'quote'
        });
        this.currentQuote = config.initialQuote || 'Нажмите "Обновить" для загрузки цитаты';
        this.author = config.author || '';
    }

    renderContent() {
        return `
            <div class="quote-container">
                <div class="quote-text">"${this.currentQuote}"</div>
                <div class="quote-author">— ${this.author}</div>
                <button class="refresh-quote-btn">Обновить</button>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const refreshBtn = this.element.querySelector('.refresh-quote-btn');
        refreshBtn.addEventListener('click', () => this.fetchQuote());
        
        // Автоматически загружаем цитату при создании
        this.fetchQuote();
    }

    async fetchQuote() {
        try {
            const refreshBtn = this.element.querySelector('.refresh-quote-btn');
            if (refreshBtn) {
                refreshBtn.textContent = 'Загрузка...';
                refreshBtn.disabled = true;
            }
            
            // Используем API для получения случайных цитат
            const response = await fetch('https://api.quotable.io/random');
            const data = await response.json();
            
            this.currentQuote = data.content;
            this.author = data.author;
            
            this.updateUI();
        } catch (error) {
            console.error('Ошибка при загрузке цитаты:', error);
            this.currentQuote = 'Не удалось загрузить цитату. Проверьте подключение к интернету.';
            this.author = '';
            this.updateUI();
        } finally {
            const refreshBtn = this.element.querySelector('.refresh-quote-btn');
            if (refreshBtn) {
                refreshBtn.textContent = 'Обновить';
                refreshBtn.disabled = false;
            }
        }
    }

    updateUI() {
        const quoteText = this.element.querySelector('.quote-text');
        const quoteAuthor = this.element.querySelector('.quote-author');
        
        if (quoteText) quoteText.textContent = `"${this.currentQuote}"`;
        if (quoteAuthor) quoteAuthor.textContent = `— ${this.author}`;
    }
}

class WeatherWidget extends UIComponent {
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
            // Используем бесплатный API погоды для Москвы
            // Для других городов нужно будет использовать другой API с ключом
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=55.7558&longitude=37.6173&current=temperature_2m,relative_humidity_2m,apparent_temperature,wind_speed_10m,weather_code&timezone=auto`
            );
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки погоды');
            }
            
            const data = await response.json();
            const current = data.current;
            
            // Форматируем данные для отображения
            this.weatherData = {
                main: {
                    temp: current.temperature_2m,
                    feels_like: current.apparent_temperature,
                    humidity: current.relative_humidity_2m
                },
                weather: [{
                    description: this.getWeatherDescription(current.weather_code)
                }],
                wind: {
                    speed: current.wind_speed_10m
                }
            };
            
            this.updateUI();
        } catch (error) {
            console.error('Ошибка при загрузке погоды:', error);
            this.weatherData = null;
            this.updateUIWithError('Не удалось загрузить погоду для Москвы');
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

    updateUI() {
        const weatherInfo = this.element.querySelector('.weather-info');
        if (weatherInfo) {
            weatherInfo.innerHTML = this.renderWeather();
        }
    }

    updateUIWithError(message) {
        const weatherInfo = this.element.querySelector('.weather-info');
        if (weatherInfo) {
            weatherInfo.innerHTML = `<p class="weather-error">${message}</p>`;
        }
    }
}

class NotesWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Заметки',
            type: 'notes'
        });
        this.notes = config.notes || [''];
    }

    renderContent() {
        return `
            <div class="notes-container">
                <div class="notes-list">
                    ${this.notes.map((note, index) => `
                        <div class="note-item">
                            <textarea class="note-textarea" placeholder="Введите заметку...">${note}</textarea>
                            ${this.notes.length > 1 ? `<button class="delete-note-btn" data-index="${index}">×</button>` : ''}
                        </div>
                    `).join('')}
                </div>
                <button class="add-note-btn">+ Добавить заметку</button>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const addBtn = this.element.querySelector('.add-note-btn');
        const notesList = this.element.querySelector('.notes-list');
        
        addBtn.addEventListener('click', () => this.addNote());
        
        notesList.addEventListener('click', (e) => {
            if (e.target.classList.contains('delete-note-btn')) {
                this.deleteNote(parseInt(e.target.dataset.index));
            }
        });
        
        notesList.addEventListener('input', (e) => {
            if (e.target.classList.contains('note-textarea')) {
                this.saveNotes();
            }
        });
    }

    addNote() {
        this.notes.push('');
        this.updateUI();
    }

    deleteNote(index) {
        if (this.notes.length > 1) {
            this.notes.splice(index, 1);
            this.updateUI();
        }
    }

    saveNotes() {
        const textareas = this.element.querySelectorAll('.note-textarea');
        this.notes = Array.from(textareas).map(textarea => textarea.value);
    }

    updateUI() {
        const notesList = this.element.querySelector('.notes-list');
        if (notesList) {
            notesList.innerHTML = this.notes.map((note, index) => `
                <div class="note-item">
                    <textarea class="note-textarea" placeholder="Введите заметку...">${note}</textarea>
                    ${this.notes.length > 1 ? `<button class="delete-note-btn" data-index="${index}">×</button>` : ''}
                </div>
            `).join('');
        }
    }
}

class CurrencyWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Курсы валют',
            type: 'currency'
        });
        this.rates = config.rates || {};
    }

    renderContent() {
        return `
            <div class="currency-container">
                <div class="currency-info">
                    ${Object.keys(this.rates).length ? this.renderRates() : '<p>Загрузка курсов...</p>'}
                </div>
                <button class="refresh-currency-btn">Обновить</button>
            </div>
        `;
    }

    renderRates() {
        return `
            <div class="currency-rates">
                <div class="currency-rate">
                    <span>USD/RUB:</span>
                    <span>${this.rates.USD || '—'}</span>
                </div>
                <div class="currency-rate">
                    <span>EUR/RUB:</span>
                    <span>${this.rates.EUR || '—'}</span>
                </div>
                <div class="currency-rate">
                    <span>GBP/RUB:</span>
                    <span>${this.rates.GBP || '—'}</span>
                </div>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const refreshBtn = this.element.querySelector('.refresh-currency-btn');
        refreshBtn.addEventListener('click', () => this.fetchRates());
        
        // Загружаем курсы при создании
        this.fetchRates();
    }

    async fetchRates() {
        try {
            const refreshBtn = this.element.querySelector('.refresh-currency-btn');
            refreshBtn.textContent = 'Загрузка...';
            refreshBtn.disabled = true;
            
            // Используем бесплатный API курсов валют
            const response = await fetch('https://api.exchangerate-api.com/v4/latest/RUB');
            const data = await response.json();
            
            this.rates = {
                USD: (1 / data.rates.USD).toFixed(2),
                EUR: (1 / data.rates.EUR).toFixed(2),
                GBP: (1 / data.rates.GBP).toFixed(2)
            };
            
            this.updateUI();
        } catch (error) {
            console.error('Ошибка при загрузке курсов:', error);
            // Запасные данные на случай ошибки API
            this.rates = {
                USD: '95.45',
                EUR: '102.30',
                GBP: '118.20'
            };
            this.updateUI();
        } finally {
            const refreshBtn = this.element.querySelector('.refresh-currency-btn');
            refreshBtn.textContent = 'Обновить';
            refreshBtn.disabled = false;
        }
    }

    updateUI() {
        const currencyInfo = this.element.querySelector('.currency-info');
        if (currencyInfo) {
            currencyInfo.innerHTML = this.renderRates();
        }
    }
}

class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
    }

    addWidget(widgetType, config = {}) {
        console.log(`Добавляем виджет типа: ${widgetType}`);
        
        let widget;
        
        switch (widgetType) {
            case 'todo':
                widget = new ToDoWidget(config);
                break;
            case 'quote':
                widget = new QuoteWidget(config);
                break;
            case 'weather':
                widget = new WeatherWidget(config);
                break;
            case 'notes':
                widget = new NotesWidget(config);
                break;
            case 'currency':
                widget = new CurrencyWidget(config);
                break;
            default:
                console.error('Неизвестный тип виджета:', widgetType);
                return;
        }
        
        this.widgets.push(widget);
        this.container.appendChild(widget.render());
        
        // Сохраняем состояние в localStorage
        this.saveToLocalStorage();
        
        return widget;
    }

    removeWidget(widgetId) {
        const widgetIndex = this.widgets.findIndex(w => w.id === widgetId);
        
        if (widgetIndex !== -1) {
            const widget = this.widgets[widgetIndex];
            widget.destroy();
            this.widgets.splice(widgetIndex, 1);
            
            // Сохраняем состояние в localStorage
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        const dashboardState = this.widgets.map(widget => ({
            type: widget.type,
            id: widget.id,
            title: widget.title,
            data: this.getWidgetData(widget)
        }));
        
        localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
    }

    loadFromLocalStorage() {
        const savedState = localStorage.getItem('dashboardState');
        
        if (savedState) {
            try {
                const widgetsState = JSON.parse(savedState);
                
                // Очищаем текущие виджеты
                this.widgets.forEach(widget => {
                    if (widget.element && widget.element.parentNode) {
                        widget.element.parentNode.removeChild(widget.element);
                    }
                });
                this.widgets = [];
                
                // Восстанавливаем виджеты из сохраненного состояния
                widgetsState.forEach(widgetState => {
                    this.addWidget(widgetState.type, {
                        id: widgetState.id,
                        title: widgetState.title,
                        ...widgetState.data
                    });
                });
            } catch (error) {
                console.error('Ошибка при загрузке состояния:', error);
            }
        }
    }

    getWidgetData(widget) {
        switch (widget.type) {
            case 'todo':
                return { tasks: widget.tasks };
            case 'quote':
                return { 
                    initialQuote: widget.currentQuote,
                    author: widget.author
                };
            case 'weather':
                return { city: widget.city };
            case 'notes':
                return { notes: widget.notes };
            case 'currency':
                return { rates: widget.rates };
            default:
                return {};
        }
    }
}

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('Приложение загружается...');
    
    const dashboard = new Dashboard('dashboard');
    
    // Загружаем сохраненное состояние
    dashboard.loadFromLocalStorage();
    
    // Назначаем обработчики для кнопок добавления виджетов
    document.getElementById('add-todo').addEventListener('click', () => {
        console.log('Добавляем ToDo виджет');
        dashboard.addWidget('todo');
    });
    
    document.getElementById('add-quote').addEventListener('click', () => {
        console.log('Добавляем Quote виджет');
        dashboard.addWidget('quote');
    });
    
    document.getElementById('add-weather').addEventListener('click', () => {
        console.log('Добавляем Weather виджет');
        dashboard.addWidget('weather');
    });
    
    document.getElementById('add-notes').addEventListener('click', () => {
        console.log('Добавляем Notes виджет');
        dashboard.addWidget('notes');
    });
    
    document.getElementById('add-currency').addEventListener('click', () => {
        console.log('Добавляем Currency виджет');
        dashboard.addWidget('currency');
    });
    
    // Для отладки
    window.dashboard = dashboard;
    console.log('Приложение инициализировано');
});