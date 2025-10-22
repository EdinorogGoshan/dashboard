import { UIComponent } from './UIComponent.js';

export class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({
            ...config,
            title: config.title || 'Случайная цитата',
            type: 'quote'
        });
        
        this.quotes = [
            {
                text: "Лучший способ начать делать — перестать говорить и начать делать.",
                author: "Уолт Дисней"
            },
            {
                text: "Успех — это идти от неудачи к неудаче, не теряя энтузиазма.",
                author: "Уинстон Черчилль"
            },
            {
                text: "Единственный способ делать великие дела — любить то, что вы делаете.",
                author: "Стив Джобс"
            },
            {
                text: "Не ждите. Время никогда не будет подходящим.",
                author: "Наполеон Хилл"
            },
            {
                text: "Сложнее всего начать действовать, все остальное зависит только от упорства.",
                author: "Амелия Эрхарт"
            }
        ];
        
        this.currentQuoteIndex = config.initialIndex !== undefined ? 
            config.initialIndex : 
            Math.floor(Math.random() * this.quotes.length);
            
        this.updateCurrentQuote();
    }

    updateCurrentQuote() {
        const quote = this.quotes[this.currentQuoteIndex];
        this.currentQuote = quote.text;
        this.author = quote.author;
    }

    renderContent() {
        return `
            <div class="quote-container">
                <div class="quote-text">"${this.currentQuote}"</div>
                <div class="quote-author">— ${this.author}</div>
                <button class="refresh-quote-btn">Следующая цитата</button>
            </div>
        `;
    }

    bindEvents() {
        super.bindEvents();
        
        if (!this.element) return;
        
        const refreshBtn = this.element.querySelector('.refresh-quote-btn');
        refreshBtn.addEventListener('click', () => this.nextQuote());
    }

    nextQuote() {
        this.currentQuoteIndex = (this.currentQuoteIndex + 1) % this.quotes.length;
        this.updateCurrentQuote();
        this.updateUI();
        
        if (typeof this.onStateChange === 'function') {
            this.onStateChange();
        }
    }

    updateUI() {
        const quoteText = this.element.querySelector('.quote-text');
        const quoteAuthor = this.element.querySelector('.quote-author');
        
        if (quoteText) quoteText.textContent = `"${this.currentQuote}"`;
        if (quoteAuthor) quoteAuthor.textContent = `— ${this.author}`;
    }
}