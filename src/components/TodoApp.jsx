import React, { useState, useEffect } from "react";
import logo from '../assets/logo.png';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import "../App.css";

const TodoApp = () => {
  const [todos, setTodos] = useState(() => {
    const savedTodos = localStorage.getItem("todos");
    return savedTodos ? JSON.parse(savedTodos) : [];
  });

  const [task, setTask] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [priority, setPriority] = useState("medium");
  const [editId, setEditId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  const handleAddOrEdit = () => {
    if (!task.trim() || !dueDate) return;

    if (editId !== null) {
      setTodos(
        todos.map((todo) =>
          todo.id === editId ? { ...todo, text: task, dueDate:new Date(dueDate).toISOString(), priority } : todo
        )
      );
      setEditId(null);
    } else {
      setTodos([
        ...todos,
        { id: Date.now().toString(), text: task, dueDate:new Date(dueDate).toISOString(), priority, completed: false },
      ]);
    }

    setTask("");
    setDueDate("");
    setPriority("medium");
  };

  const handleDelete = (id) => {
   setTodos(todos.filter((todo) => todo.id !== id));
  };

  const handleEdit = (id, text, dueDate, priority) => {
    setTask(text);
    setDueDate(dueDate);
    setPriority(priority);
    setEditId(id);
  };

  const handleToggleComplete = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const updatedTodos = Array.from(todos);
    const [movedTask] = updatedTodos.splice(result.source.index, 1);
    updatedTodos.splice(result.destination.index, 0, movedTask);

    setTodos(updatedTodos);
  };

  const completedTasks = todos.filter((todo) => todo.completed).length;
  const totalTasks = todos.length;
  const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const filteredTodos = todos
    .filter((todo) => {
      if (filter === "completed") return todo.completed;
      if (filter === "pending") return !todo.completed;
      return true;
    })
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .sort((a, b) => {
      const priorityOrder = { high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h2>To-Do Lists
        < img src= {logo} alt="Logo" width="30" height="30" />
      </h2>

      <button className="dark-mode-btn" onClick={toggleDarkMode}>
        {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
      </button>

      <div className="input-container">
        <input
          type="text"
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="Enter task..."
        />
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="high">🔴 High</option>
          <option value="medium">🟡 Medium</option>
          <option value="low">🟢 Low</option>
        </select>
        <button className="add-btn" onClick={handleAddOrEdit}>
          {editId !== null ? "✏️ Update" : "➕ Add"}
        </button>
      </div>

      <div className="progress-tracker">
        <p>Task Completion: {progress}%</p>
        <progress value={progress} max="100"></progress>
      </div>

      <div className="filters">
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>📋 All</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>✅ Completed</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>⏳ Pending</button>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="todos"isDropDisabled={false} isCombineEnabled={false} ignoreContainerClipping={false}>
          {(provided) => (
            <ul {...provided.droppableProps} ref={provided.innerRef}>
              {filteredTodos.map((todo, index) => (
                <Draggable key={todo.id} draggableId={todo.id} index={index}>
                  {(provided) => (
                    <li
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={todo.completed ? "completed" : ""}
                    >
                      <span onClick={() => handleToggleComplete(todo.id)}>
                        {todo.completed ? "✅" : "⭕"} {todo.text} - 📅 {new Date(todo.dueDate).toLocaleDateString("en-US")} -

                        {todo.priority === "high" ? " 🔴 High" : todo.priority === "medium" ? " 🟡 Medium" : " 🟢 Low"}
                      </span>
                      <div>
                        <button className="edit-btn" onClick={() => handleEdit(todo.id, todo.text, todo.dueDate, todo.priority)}>✏️</button>
                        <button className="delete-btn" onClick={() => handleDelete(todo.id)}>❌</button>
                      </div>
                    </li>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </ul>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TodoApp; 

