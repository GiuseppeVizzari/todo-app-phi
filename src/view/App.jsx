import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './App.css';
import TodoList from './TodoList.jsx';
import Archive from './Archive.jsx';
import UserProfile from './UserProfile.jsx';
import LoginButton from './LoginButton.jsx';
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
 * Now includes Supabase Authentication:
 * - Manages auth session state
 * - Shows login screen when no session exists
 * - Shows user profile and todo list when authenticated
 * - Passes user ID to ViewModel for data scoping
 */
function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Bind to the ViewModel with user ID for data scoping
  const userId = session?.user?.id || 'anonymous';
  // Note: We might want to block 'anonymous' if strictly requiring auth, 
  // but for ViewModel initialization it's fine.

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
  } = useTodoViewModel(userId);

  // Show loading state while Auth initialization
  if (loading) {
    return (
      <div className="app-container">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Show login screen when not authenticated
  if (!session) {
    return (
      <div className="app-container">
        <div className="login-container">
          <h1>Todo List</h1>
          <p>Please log in to access your todos</p>
          <LoginButton />
        </div>
      </div>
    );
  }

  // Show main app when authenticated
  return (
    <div className="app-container">
      <div className="app-header">
        <h1>Todo List</h1>
        <UserProfile key={session.user.id} session={session} />
      </div>

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
