import { UIComponent } from './UIComponent.js';

export class ToDoWidget extends UIComponent {
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