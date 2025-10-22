import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { NotesWidget } from './NotesWidget.js';
import { CurrencyWidget } from './CurrencyWidget.js';

export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
        this.isInitialized = false;
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
        
        widget.onDestroy = (widgetId) => this.handleWidgetDestroy(widgetId);
        widget.onStateChange = () => this.saveToLocalStorage();
        
        this.widgets.push(widget);
        this.container.appendChild(widget.render());
        
        if (this.isInitialized) {
            this.saveToLocalStorage();
        }
        
        return widget;
    }

    handleWidgetDestroy(widgetId) {
        console.log(`Удаляем виджет: ${widgetId}`);
        
        const widgetIndex = this.widgets.findIndex(w => w.id === widgetId);
        if (widgetIndex !== -1) {
            this.widgets.splice(widgetIndex, 1);
            this.saveToLocalStorage();
        }
    }

    saveToLocalStorage() {
        try {
            const dashboardState = this.widgets.map(widget => ({
                type: widget.type,
                id: widget.id,
                title: widget.title,
                data: this.getWidgetData(widget)
            }));
            
            localStorage.setItem('dashboardState', JSON.stringify(dashboardState));
            console.log('Сохранено виджетов:', this.widgets.length);
        } catch (error) {
            console.error('Ошибка при сохранении:', error);
        }
    }

    loadFromLocalStorage() {
        try {
            const savedState = localStorage.getItem('dashboardState');
            
            if (savedState) {
                const widgetsState = JSON.parse(savedState);
                console.log('Загружаем сохраненные виджеты:', widgetsState.length);
                
                widgetsState.forEach(widgetState => {
                    this.addWidget(widgetState.type, {
                        id: widgetState.id,
                        title: widgetState.title,
                        ...widgetState.data
                    });
                });
            }
            
            this.isInitialized = true;
            
        } catch (error) {
            console.error('Ошибка при загрузке:', error);
            localStorage.removeItem('dashboardState');
            this.isInitialized = true;
        }
    }

    getWidgetData(widget) {
        switch (widget.type) {
            case 'todo':
                return { tasks: widget.tasks || [] };
            case 'quote':
                return { initialIndex: widget.currentQuoteIndex || 0 };
            case 'weather':
                return { weatherData: widget.weatherData || null };
            case 'notes':
                return { notes: widget.notes || [''] };
            case 'currency':
                return { rates: widget.rates || {} };
            default:
                return {};
        }
    }

    clearAll() {
        this.widgets.forEach(widget => {
            if (widget.element && widget.element.parentNode) {
                widget.element.parentNode.removeChild(widget.element);
            }
        });
        this.widgets = [];
        localStorage.removeItem('dashboardState');
        console.log('Все данные очищены');
    }
}