import { UIComponent } from './UIComponent.js';

export class NotesWidget extends UIComponent {
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