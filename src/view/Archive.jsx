import React from 'react';

/**
 * Archive.jsx
 *
 * VIEW LAYER
 *
 * Displays the list of archived todos.
 * Purely presentational component.
 */
function Archive({ archivedTodos, unarchiveTodo, deleteArchivedTodo }) {
  return (
    <div>
      {archivedTodos.map((todo) => (
        <div key={todo.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px' }}>
          <span style={{ textDecoration: 'line-through' }}>
            {todo.text} (Due: {todo.dueDate})
          </span>
          <button onClick={() => unarchiveTodo(todo.id)}>Unarchive</button>
          <button onClick={() => deleteArchivedTodo(todo.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}

export default Archive;
