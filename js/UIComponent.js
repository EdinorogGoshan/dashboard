export class UIComponent {
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
        content.style.display = this.isMinimized ? 'none' : 'block';
    }

    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.element = null;
        
        if (typeof this.onDestroy === 'function') {
            this.onDestroy(this.id);
        }
    }
}