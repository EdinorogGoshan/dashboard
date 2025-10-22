import { Dashboard } from './js/Dashboard.js';

// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    console.log('Приложение загружается...');
    
    const dashboard = new Dashboard('dashboard');
    
    // Загружаем сохраненное состояние
    dashboard.loadFromLocalStorage();
    
    // Назначаем обработчики для кнопок добавления виджетов
    document.getElementById('add-todo').addEventListener('click', () => {
        dashboard.addWidget('todo');
    });
    
    document.getElementById('add-quote').addEventListener('click', () => {
        dashboard.addWidget('quote');
    });
    
    document.getElementById('add-weather').addEventListener('click', () => {
        dashboard.addWidget('weather');
    });
    
    document.getElementById('add-notes').addEventListener('click', () => {
        dashboard.addWidget('notes');
    });
    
    document.getElementById('add-currency').addEventListener('click', () => {
        dashboard.addWidget('currency');
    });
    
    document.getElementById('clear-all').addEventListener('click', () => {
        if (confirm('Очистить все виджеты и данные?')) {
            dashboard.clearAll();
        }
    });
    
    window.dashboard = dashboard;
    console.log('Приложение инициализировано');
});