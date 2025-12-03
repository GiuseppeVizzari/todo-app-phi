/**
 * TodoModel.js
 *
 * MODEL LAYER
 *
 * This file represents the "Model" in the MVVM pattern.
 * The Model is responsible for:
 * 1. Defining the data structure (schema) of the application.
 * 2. Containing business logic and rules (e.g., validation, data creation).
 * 3. Being independent of the User Interface (View) and State Management (ViewModel).
 */

export class TodoModel {
    constructor(text, dueDate = '') {
        this.id = Date.now(); // Unique identifier based on timestamp
        this.text = text;
        this.completed = false;
        this.dueDate = dueDate;
    }

    /**
     * Factory method to create a new Todo instance.
     * Encapsulates the creation logic.
     */
    static create(text, dueDate) {
        if (!text || text.trim() === '') {
            throw new Error('Todo text cannot be empty');
        }
        return new TodoModel(text, dueDate);
    }
}
