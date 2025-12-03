import React, { useState } from 'react';

/**
 * TodoItem.jsx
 *
 * VIEW LAYER
 *
 * Represents a single todo item in the UI.
 * Handles local UI state (isEditing) but delegates data changes to props.
 */
function TodoItem({ todo, toggleComplete, editTodo, deleteTodo }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleToggleEdit = () => {
    setIsEditing(!isEditing);
  };

  const handleSubmitEdit = (e) => {
    e.preventDefault();
    editTodo({ text: editedText });
    setIsEditing(false);
  };

  return (
    <div style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
      {isEditing ? (
        <form onSubmit={handleSubmitEdit}>
          <input
            type="text"
            value={editedText}
            onChange={(e) => setEditedText(e.target.value)}
          />
          <button type="submit">Save</button>
        </form>
      ) : (
        <>
          <span>{todo.text} (Due: {todo.dueDate})</span>
          <button onClick={toggleComplete}>
            {todo.completed ? 'Mark Incomplete' : 'Mark Complete'}
          </button>
          <button onClick={handleToggleEdit}>Edit</button>
          <button onClick={() => deleteTodo()}>Delete</button>
        </>
      )}
    </div>
  );
}

export default TodoItem;
