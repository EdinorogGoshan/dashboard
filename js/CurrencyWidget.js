import { UIComponent } from './UIComponent.js';

export class CurrencyWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Курсы валют',
            type: 'currency'
        });
        
        this.rates = config.rates || {
            USD: '95.45',
            EUR: '102.30',
            GBP: '118.20'
        };
    }

    renderContent() {
        return `
            <div class="currency-container">
                <div class="currency-info">
                    ${this.renderRates()}
                </div>
                <button class="refresh-currency-btn">Обновить курсы</button>
                <div class="currency-note">*Демонстрационные данные</div>
            </div>
        `;
    }

    renderRates() {
        return `
            <div class="currency-rates">
                <div class="currency-rate">
                    <span>USD/RUB:</span>
                    <span>${this.rates.USD}</span>
                </div>
                <div class="currency-rate">
                    <span>EUR/RUB:</span>
                    <span>${this.rates.EUR}</span>
                </div>
                <div class="currency-rate">
                    <span>GBP/RUB:</span>
                    <span>${this.rates.GBP}</span>
                </div>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const refreshBtn = this.element.querySelector('.refresh-currency-btn');
        refreshBtn.addEventListener('click', () => this.updateRates());
    }

    updateRates() {
        const change = (Math.random() - 0.5) * 2;
        
        this.rates = {
            USD: (parseFloat(this.rates.USD) + change).toFixed(2),
            EUR: (parseFloat(this.rates.EUR) + change).toFixed(2),
            GBP: (parseFloat(this.rates.GBP) + change).toFixed(2)
        };
        
        this.updateUI();
        
        if (typeof this.onStateChange === 'function') {
            this.onStateChange();
        }
    }

    updateUI() {
        const currencyInfo = this.element.querySelector('.currency-info');
        if (currencyInfo) {
            currencyInfo.innerHTML = this.renderRates();
        }
    }
}