import { useState } from 'react'
import { Todo } from '../../@types/todo.types'
import styles from './TaskInput.module.scss'

interface TaskInputProps {
  addTodo: (name: string) => void
  finishEditTodo: () => void
  editTodo: (name: string) => void
  currentTodo: Todo | null
}
export default function TaskInput(props: TaskInputProps) {
  const { addTodo, currentTodo, editTodo, finishEditTodo } = props
  const [name, setName] = useState<string>('')
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (currentTodo) {
      finishEditTodo()
    } else {
      addTodo(name)
      setName('')
    }
  }

  const onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target
    if (currentTodo) {
      editTodo(value)
    } else {
      setName(value)
    }
  }
  return (
    <div>
      <h1 className={styles.taskTitle}> To do List Typescript</h1>
      <form className={styles.taskForm} onSubmit={handleSubmit}>
        <input
          type='text'
          className={styles.inputForm}
          placeholder='caption goes here'
          onChange={onChangeInput}
          value={currentTodo ? currentTodo.name : name}
        />
        <button className={styles.formSubmit}>{currentTodo ? '✔' : '➕'}</button>
      </form>
    </div>
  )
}
