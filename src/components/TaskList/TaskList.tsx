import { useState } from 'react'
import { Todo } from '../../@types/todo.types'
import styles from './TaskList.module.scss'

interface TaskListProps {
  doneTaskList?: boolean
  handleDoneTodo: (id: string, done: boolean) => void
  todos: Todo[]
  startEditTodo: (id: string) => void
}
export default function TaskList(props: TaskListProps) {
  const { doneTaskList, todos, handleDoneTodo, startEditTodo } = props
  // const [todos, setTodo] = useState([])
  const handleCheckbox = (idTodo: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    handleDoneTodo(idTodo, event.target.checked)
  }
  return (
    <div className={styles.taskList}>
      <h2 className={styles.TaskListTitle}>{doneTaskList ? 'Hoàn thành' : 'Chưa hoàn thành'}</h2>
      <div className={styles.tasks}>
        {todos.map((todo) => (
          <div className={styles.task} key={todo.id}>
            <input
              type='checkbox'
              className={styles.taskCheckbox}
              checked={todo.done}
              onChange={handleCheckbox(todo.id)}
            />
            <span className={`${styles.taskName} ${todo.done ? styles.taskNameDone : ''}`}>{todo.name}</span>
            <div className={styles.taskAction}>
              <button className={styles.taskEdit} onClick={() => startEditTodo(todo.id)}>
                🖊
              </button>
              <button className={styles.taskDelete}>🗑</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
