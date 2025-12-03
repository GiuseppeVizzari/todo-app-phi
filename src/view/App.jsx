import React from 'react';
import './App.css';
import TodoList from './TodoList.jsx';
import Archive from './Archive.jsx';
import { useTodoViewModel } from '../viewmodel/useTodoViewModel';

/**
 * App.jsx
 *
 * VIEW LAYER
 *
 * This component represents the "View" in the MVVM pattern.
 * The View is responsible for:
 * 1. Rendering the User Interface (UI).
 * 2. Binding to the ViewModel to get state and methods.
 * 3. Passing data and commands to child components.
 *
 * It contains NO business logic. It just displays what the ViewModel provides.
 */
function App() {
  // Bind to the ViewModel
  const {
    todos,
    archivedTodos,
    addTodo,
    toggleComplete,
    editTodo,
    deleteTodo,
    archiveCompleted,
    unarchiveTodo,
    deleteArchivedTodo,
  } = useTodoViewModel();

  return (
    <div className="app-container">
      <h1>Todo List</h1>

      <div className="todo-section">
        <TodoList
          todos={todos}
          addTodo={addTodo}
          toggleComplete={toggleComplete}
          editTodo={editTodo}
          deleteTodo={deleteTodo}
        />
        <div className="archive-actions">
          <button onClick={archiveCompleted}>Archive Completed Todos</button>
        </div>
      </div>

      {archivedTodos.length > 0 && (
        <div className="archive-section">
          <h2>Archived Todos</h2>
          <Archive
            archivedTodos={archivedTodos}
            unarchiveTodo={unarchiveTodo}
            deleteArchivedTodo={deleteArchivedTodo}
          />
        </div>
      )}
    </div>
  );
}

export default App;
