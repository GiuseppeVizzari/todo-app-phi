import { useState, useEffect } from 'react';
import { TodoModel } from '../model/TodoModel';
import { TodoService } from '../service/TodoService';

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
 *
 * USER-SCOPED DATA:
 * This ViewModel now accepts a userId parameter to scope todos per user.
 * It uses TodoService to persist data to Supabase.
 */
export function useTodoViewModel(userId = 'anonymous') {
    // State to hold the list of active todos
    const [todos, setTodos] = useState([]);

    // State to hold the list of archived todos (Supabase doesn't have archive table yet, so we filter locally or need schema change. 
    // For now, we will assume 'completed' ones can be archived or just kept as completed. 
    // The previous implementation had a separate archive list. 
    // To keep it simple and consistent with the new DB schema, we might just fetch all and filter?
    // Or we can stick to the plan: "Refactor ViewModel to use Supabase".
    // The DB schema has 'completed'. 
    // Let's fetch all todos and split them if needed, or just keep 'todos' as the main list.
    // The previous app had explicit 'archive' action. 
    // For this refactor, let's keep it simple: fetch all.
    const [archivedTodos, setArchivedTodos] = useState([]);

    // Fetch todos on mount or when userId changes
    useEffect(() => {
        if (!userId) return;

        const loadTodos = async () => {
            try {
                const fetchedTodos = await TodoService.getAllTodos();
                // Filter for current user if RLS isn't enough or for client-side safety
                // (RLS should handle it, but we pass userId to service for inserts)

                // In the previous local storage version, we had separate 'todos' and 'archivedTodos'.
                // Here, we'll just put everything in 'todos' for now, or maybe filter completed ones?
                // Let's just load everything into 'todos' and let the view handle it?
                // Or better, let's maintain the API: todos and archivedTodos.
                // Maybe 'archived' means completed?
                // The previous code: "archiveCompleted" moved completed todos to "archivedTodos".
                // So let's say:
                // todos = active (not completed)
                // archivedTodos = completed
                // This changes the semantics slightly (completed vs archived), but it maps well to a single table.

                // However, the user might want to keep "completed but not archived" state.
                // But the DB schema only has 'completed'.
                // Let's assume for this integration: 
                // - Active list = !completed
                // - Archive list = completed

                const active = fetchedTodos.filter(t => !t.completed);
                const completed = fetchedTodos.filter(t => t.completed);

                setTodos(active);
                setArchivedTodos(completed);
            } catch (error) {
                console.error("Failed to fetch todos:", error);
            }
        };

        loadTodos();
    }, [userId]);

    /**
     * Adds a new todo to the list.
     * Uses the Model to create a valid todo object.
     */
    const addTodo = async (text, dueDate) => {
        try {
            const newTodoModel = TodoModel.create(text, dueDate);
            // Optimistic update
            setTodos(prev => [...prev, newTodoModel]);

            const savedTodo = await TodoService.addTodo(newTodoModel, userId);

            // Update with real ID from DB
            setTodos(prev => prev.map(t => t === newTodoModel ? savedTodo : t));
        } catch (error) {
            console.error("Failed to create todo:", error.message);
            // Revert optimistic update if needed
        }
    };

    /**
     * Toggles the completion status of a todo.
     */
    const toggleComplete = async (id) => {
        const todo = todos.find(t => t.id === id) || archivedTodos.find(t => t.id === id);
        if (!todo) return;

        const updatedTodo = { ...todo, completed: !todo.completed };

        // Optimistic update
        if (updatedTodo.completed) {
            // Moved to archive/completed
            setTodos(prev => prev.filter(t => t.id !== id));
            setArchivedTodos(prev => [...prev, updatedTodo]);
        } else {
            // Moved to active
            setArchivedTodos(prev => prev.filter(t => t.id !== id));
            setTodos(prev => [...prev, updatedTodo]);
        }

        try {
            await TodoService.updateTodo(updatedTodo);
        } catch (error) {
            console.error("Failed to update todo:", error);
            // Revert
        }
    };

    /**
     * Edits the text or properties of an existing todo.
     */
    const editTodo = async (id, updatedFields) => {
        const todo = todos.find(t => t.id === id);
        if (!todo) return;

        const updatedTodo = { ...todo, ...updatedFields };

        setTodos(prev => prev.map(t => t.id === id ? updatedTodo : t));

        try {
            await TodoService.updateTodo(updatedTodo);
        } catch (error) {
            console.error("Failed to edit todo:", error);
        }
    };

    /**
     * Deletes a todo from the active list.
     */
    const deleteTodo = async (id) => {
        setTodos(prev => prev.filter(t => t.id !== id));
        try {
            await TodoService.deleteTodo(id);
        } catch (error) {
            console.error("Failed to delete todo:", error);
        }
    };

    /**
     * Archives all completed todos.
     * In this new Supabase mapping, "completed" IS "archived" effectively.
     * So this function might be redundant if we auto-move on toggle.
     * But if we want to keep the "Move to Archive" button behavior:
     * We can just ensure they are in the archived list.
     */
    const archiveCompleted = () => {
        // In this implementation, toggleComplete already moves them.
        // So this might be a no-op or just ensuring consistency.
    };

    /**
     * Unarchives a todo, moving it back to the active list.
     * It is marked as incomplete upon unarchiving.
     */
    const unarchiveTodo = async (id) => {
        const todo = archivedTodos.find(t => t.id === id);
        if (!todo) return;

        const updatedTodo = { ...todo, completed: false };

        setArchivedTodos(prev => prev.filter(t => t.id !== id));
        setTodos(prev => [...prev, updatedTodo]);

        try {
            await TodoService.updateTodo(updatedTodo);
        } catch (error) {
            console.error("Failed to unarchive todo:", error);
        }
    };

    /**
     * Permanently deletes a todo from the archive.
     */
    const deleteArchivedTodo = async (id) => {
        setArchivedTodos(prev => prev.filter(t => t.id !== id));
        try {
            await TodoService.deleteTodo(id);
        } catch (error) {
            console.error("Failed to delete archived todo:", error);
        }
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
