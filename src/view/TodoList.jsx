import React, { useState } from 'react';
import TodoItem from './TodoItem.jsx';

/**
 * TodoList.jsx
 *
 * VIEW LAYER
 *
 * This component is part of the View.
 * It receives data (todos) and commands (addTodo, etc.) from the parent View (App),
 * which in turn got them from the ViewModel.
 */
function TodoList({ todos, addTodo, toggleComplete, editTodo, deleteTodo }) {
  const [newTodo, setNewTodo] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newTodo.trim()) return;
    addTodo(newTodo, dueDate);
    setNewTodo('');
    setDueDate('');
  };

  return (
    <div>
      <h2>Current Todos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Enter a new todo"
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button type="submit">Add Todo</button>
      </form>

      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          toggleComplete={() => toggleComplete(todo.id)}
          editTodo={(updatedFields) =>
            editTodo(todo.id, updatedFields)
          }
          deleteTodo={() => deleteTodo(todo.id)}
        />
      ))}
    </div>
  );
}

export default TodoList;
