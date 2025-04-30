// ✅ App.jsx (태그 기능 포함 전체코드)

import { useState, useEffect } from 'react';
import styles from './App.module.css';
import TodoItem from './components/TodoItem';

const TAGS = ['전체', '공부', '운동', '업무'];

function App() {
  const [input, setInput] = useState('');
  const [inputTag, setInputTag] = useState('공부');
  const [selectedTag, setSelectedTag] = useState('전체');
  const [todos, setTodos] = useState(() => {
    const stored = localStorage.getItem('my-todos');
    return stored ? JSON.parse(stored) : [];
  });
  const [filter, setFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('desc');
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });

  const total = todos.length;
  const completed = todos.filter((todo) => todo.done).length;
  const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark-body' : '';
    document.documentElement.className = theme === 'dark' ? 'dark-html' : '';
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('my-todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleAdd = () => {
    if (!input.trim()) return;
    const newTodo = {
      id: Date.now(),
      text: input,
      done: false,
      tag: inputTag,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
    setInput('');
  };

  const handleToggle = (id) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    );
    setTodos(updated);
  };

  const handleDelete = (id) => {
    const updated = todos.filter((todo) => todo.id !== id);
    setTodos(updated);
  };

  const handleEdit = (id, newText) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, text: newText } : todo
    );
    setTodos(updated);
  };

  const handleDeleteAll = () => {
    if (window.confirm('정말 전체 삭제하시겠습니까?')) {
      setTodos([]);
    }
  };

  const handleDeleteCompleted = () => {
    const updated = todos.filter((todo) => !todo.done);
    setTodos(updated);
  };

  const sortedAndFilteredTodos = todos
    .slice()
    .sort((a, b) => {
      return sortOrder === 'asc'
        ? new Date(a.createdAt) - new Date(b.createdAt)
        : new Date(b.createdAt) - new Date(a.createdAt);
    })
    .filter((todo) => {
      if (filter === 'done' && !todo.done) return false;
      if (filter === 'undone' && todo.done) return false;
      if (selectedTag !== '전체' && todo.tag !== selectedTag) return false;
      return true;
    });

  return (
    <div className={`${styles.container} ${theme === 'dark' ? styles.dark : ''}`}>
      <div className={styles.topRight}>  
      <button
        className={`${styles.primaryButton} ${styles.themeToggle}`}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        {theme === 'light' ? '🌙 다크모드' : '☀️ 라이트모드'}
      </button>
      </div>
      
      <h1>📝 To-Do List</h1>

      <div className={styles.filterButtons}>
        <button className={filter === 'all' ? styles.active : ''} onClick={() => setFilter('all')}>전체</button>
        <button className={filter === 'done' ? styles.active : ''} onClick={() => setFilter('done')}>완료</button>
        <button className={filter === 'undone' ? styles.active : ''} onClick={() => setFilter('undone')}>미완료</button>
      </div>

      <div className={styles.sortButtons}>
        <button onClick={() => setSortOrder('desc')}>최신순</button>
        <button onClick={() => setSortOrder('asc')}>오래된순</button>
      </div>

      <div className={styles.tagFilterButtons}>
        {TAGS.map(tag => (
          <button
            key={tag}
            className={`${styles.primaryButton} ${selectedTag === tag ? styles.active : ''}`}
            onClick={() => setSelectedTag(tag)}
          >
            #{tag}
          </button>
        ))}
      </div>

      <div className={styles.summaryBox}>
        {total > 0 ? (
          <>
            <p>완료: {completed}/{total} ({percentage}%)</p>
            <div className={styles.progressBarWrapper}>
              <div
                className={styles.progressBar}
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
          </>
        ) : (
          <p>할 일이 없습니다</p>
        )}
      </div>

      <div className={styles.deleteButtons}>
        <button onClick={handleDeleteAll}>🗑 전체 삭제</button>
        <button onClick={handleDeleteCompleted}>🧹 완료만 삭제</button>
      </div>

      <div className={styles.inputArea}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="할 일을 입력하세요"
        />
        <select
          className={styles.tagSelect}
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
        >
          {TAGS.filter(tag => tag !== '전체').map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
        <button className={styles.primaryButton} onClick={handleAdd}>추가</button>
      </div>

      <ul>
        {sortedAndFilteredTodos.map((todo) => (
          <TodoItem
            key={todo.id}
            id={todo.id}
            text={todo.text}
            done={todo.done}
            tag={todo.tag}
            createdAt={todo.createdAt}
            onToggle={() => handleToggle(todo.id)}
            onDelete={() => handleDelete(todo.id)}
            onEdit={handleEdit}
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
