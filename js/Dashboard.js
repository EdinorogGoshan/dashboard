import { ToDoWidget } from './ToDoWidget.js';
import { QuoteWidget } from './QuoteWidget.js';
import { WeatherWidget } from './WeatherWidget.js';
import { NotesWidget } from './NotesWidget.js';

export class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
    }

    addWidget(widgetType, config = {}) {
        let widget;
        
        switch (widgetType) {
            case 'todo':
                widget = new ToDoWidget(config);
                break;
            case 'quote':
                widget = new QuoteWidget(config);
                // Автоматически загружаем цитату при создании виджета
                setTimeout(() => widget.fetchQuote(), 100);
                break;
            case 'weather':
                widget = new WeatherWidget(config);
                break;
            case 'notes':
                widget = new NotesWidget(config);
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
                this.widgets.forEach(widget => widget.destroy());
                this.widgets = [];
                this.container.innerHTML = '';
                
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
            default:
                return {};
        }
    }
}