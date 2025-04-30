import { useState } from 'react';
import styles from './TodoItem.module.css';

function TodoItem({ id, text, done, onToggle, onDelete, onEdit, createdAt, tag }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(text);

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return `${date.getFullYear()}.${date.getMonth() + 1}.${date.getDate()}`;
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      onEdit(id, editText.trim() || text);
      setIsEditing(false);
    } else if (e.key === 'Escape') {
      setEditText(text);
      setIsEditing(false);
    }
  };

  const handleBlur = () => {
    setEditText(text);
    setIsEditing(false);
  };

  return (
    <li className={styles.item}>
      <div className={styles.textBlock}>
        {isEditing ? (
          <input
            className={styles.editInput}
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleBlur}
            autoFocus
          />
        ) : (
          <span
            onClick={onToggle}
            onDoubleClick={() => setIsEditing(true)}
            className={done ? styles.done : ''}
          >
            {text}
          </span>
        )}
        <div className={styles.meta}>
            <span className={styles.date}>{formatDate(createdAt)}</span>
            <span className={`${styles.tag} ${styles['tag_' + tag]}`}>#{tag}</span>
        </div>
      </div>
      <button onClick={onDelete}>❌</button>
    </li>
  );
}

export default TodoItem;
