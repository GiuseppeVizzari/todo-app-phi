import { useState, useEffect } from 'react';
import { TodoModel } from '../model/TodoModel';

/**
 * useTodoViewModel.js
 *
 * VIEWMODEL LAYER
 *
 * This custom hook represents the "ViewModel" in the MVVM pattern.
 * The ViewModel is responsible for:
 * 1. Managing the state of the application (todos, archivedTodos).
 * 2. Exposing data streams or state variables to the View.
 * 3. Exposing commands or methods to handle user interactions (e.g., addTodo, toggleComplete).
 * 4. Acting as a bridge between the Model and the View.
 *
 * It does NOT know about the specific UI implementation (e.g., HTML, CSS).
 */
export function useTodoViewModel() {
    // State to hold the list of active todos
    // Initialize from localStorage if available
    const [todos, setTodos] = useState(() => {
        const savedTodos = localStorage.getItem('todos');
        return savedTodos ? JSON.parse(savedTodos) : [];
    });

    // State to hold the list of archived todos
    // Initialize from localStorage if available
    const [archivedTodos, setArchivedTodos] = useState(() => {
        const savedArchivedTodos = localStorage.getItem('archivedTodos');
        return savedArchivedTodos ? JSON.parse(savedArchivedTodos) : [];
    });

    // Save todos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('todos', JSON.stringify(todos));
    }, [todos]);

    // Save archivedTodos to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('archivedTodos', JSON.stringify(archivedTodos));
    }, [archivedTodos]);

    /**
     * Adds a new todo to the list.
     * Uses the Model to create a valid todo object.
     */
    const addTodo = (text, dueDate) => {
        try {
            const newTodo = TodoModel.create(text, dueDate);
            setTodos([...todos, newTodo]);
        } catch (error) {
            console.error("Failed to create todo:", error.message);
            // In a real app, you might expose an error state to the View here
        }
    };

    /**
     * Toggles the completion status of a todo.
     */
    const toggleComplete = (id) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, completed: !todo.completed } : todo
            )
        );
    };

    /**
     * Edits the text or properties of an existing todo.
     */
    const editTodo = (id, updatedFields) => {
        setTodos(
            todos.map((todo) =>
                todo.id === id ? { ...todo, ...updatedFields } : todo
            )
        );
    };

    /**
     * Deletes a todo from the active list.
     */
    const deleteTodo = (id) => {
        setTodos(todos.filter((todo) => todo.id !== id));
    };

    /**
     * Archives all completed todos.
     * Moves them from the 'todos' list to the 'archivedTodos' list.
     */
    const archiveCompleted = () => {
        const incompleteTodos = todos.filter((todo) => !todo.completed);
        const completedTodos = todos.filter((todo) => todo.completed);

        setTodos(incompleteTodos);
        setArchivedTodos([...archivedTodos, ...completedTodos]);
    };

    /**
     * Unarchives a todo, moving it back to the active list.
     * It is marked as incomplete upon unarchiving.
     */
    const unarchiveTodo = (id) => {
        const todoToUnarchive = archivedTodos.find((todo) => todo.id === id);
        if (todoToUnarchive) {
            setArchivedTodos(archivedTodos.filter((todo) => todo.id !== id));
            // Reset completed status when bringing back to active list
            setTodos([...todos, { ...todoToUnarchive, completed: false }]);
        }
    };

    /**
     * Permanently deletes a todo from the archive.
     */
    const deleteArchivedTodo = (id) => {
        setArchivedTodos(archivedTodos.filter((todo) => todo.id !== id));
    };

    // Return the state and methods needed by the View
    return {
        todos,
        archivedTodos,
        addTodo,
        toggleComplete,
        editTodo,
        deleteTodo,
        archiveCompleted,
        unarchiveTodo,
        deleteArchivedTodo,
    };
}
