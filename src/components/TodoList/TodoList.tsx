import TaskInput from '../TaskInput'
import PropTypes from 'prop-types'

import TaskList from '../TaskList'
import { Todo } from '../../@types/todo.types'
import styles from './todoList.module.scss'
import { useEffect, useState } from 'react'
import { TodoTypes } from '../../PropTypes/todo.proptype'

//This interface type defines a handler function with one argument of type Todo[] and returns an array of type Todo. The function will be used to handle new Todo objects.
interface handleNewTodo {
  (todos: Todo[]): Todo[]
}

// type handleNewTodo = (todos: Todo[]) => Todo[]
// return callback
const syncReactToLocal = (handleNewTodo: handleNewTodo) => {
  const todoString = localStorage.getItem('todos')
  const todoObj: Todo[] = JSON.parse(todoString || '[]')
  const newTodosObj = handleNewTodo(todoObj)
  localStorage.setItem('todos', JSON.stringify(newTodosObj))
}
export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  // Lấy cái edit hiện tại (để kiểm tra edit)
  const [currentTodo, setCurrentTodo] = useState<Todo | null>(null)

  const doneTodos = todos.filter((todo) => todo.done)
  const notdoneTodos = todos.filter((todo) => !todo.done)

  useEffect(() => {
    const todoString = localStorage.getItem('todos')
    const todoObj: Todo[] = JSON.parse(todoString || '[]')
    setTodos(todoObj)
  }, [])
  const addTodo = (name: string) => {
    const handler = (todoObj: Todo[]) => {
      return [...todoObj, todo]
    }
    const todo: Todo = {
      name,
      done: false,
      id: new Date().toISOString()
    }

    setTodos((prev) => [...prev, todo])

    syncReactToLocal(handler)
  }
  const handleDoneTodo = (id: string, done: boolean) => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    }
    setTodos((prev) => {
      return prev.map((todo) => {
        if (todo.id === id) {
          return { ...todo, done }
        }
        return todo
      })
    })
    syncReactToLocal(handler)
  }

  const startEditTodo = (id: string) => {
    const todoFilter = todos.find((todo) => todo.id === id)
    if (todoFilter) setCurrentTodo(todoFilter)
  }

  const editTodo = (name: string) => {
    setCurrentTodo((prev) => {
      if (prev) return { ...prev, name }
      return null
    })
  }

  const finishEditTodo = () => {
    const handler = (todoObj: Todo[]) => {
      return todoObj.map((todo) => {
        // If we find the todo with the id matching the currentTodo then we will use the new value for it
        if (todo.id === (currentTodo as Todo).id) {
          return currentTodo as Todo
        }
        // otherwise, we will return the todo unmodified
        return todo
      })
    }
    // setTodos uses a map function to update the list of todos to the new currentTodo
    setTodos(handler)
    setCurrentTodo(null)
    const todoString = localStorage.getItem('todos')
    const todoObj: Todo[] = JSON.parse(todoString || '[]')
    const newTodosObj = handler(todoObj)
    localStorage.setItem('todos', JSON.stringify(newTodosObj))
  }
  const deleteTodo = (id: string) => {
    if (currentTodo) {
      setCurrentTodo(null)
    }
    const handler = (todosObj: Todo[]) => {
      return todosObj.filter((todo) => todo.id !== id)
    }
    setTodos(handler)
    syncReactToLocal(handler)
  }
  return (
    <div className={styles.todoList}>
      <div className={styles.todoListContainer}>
        <TaskInput addTodo={addTodo} editTodo={editTodo} currentTodo={currentTodo} finishEditTodo={finishEditTodo} />
        <TaskList
          todos={notdoneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
        <TaskList
          doneTaskList
          todos={doneTodos}
          handleDoneTodo={handleDoneTodo}
          startEditTodo={startEditTodo}
          deleteTodo={deleteTodo}
        />
      </div>
    </div>
  )
}

TodoList.propTypes = {
  doneTaskList: PropTypes.bool,
  todos: PropTypes.arrayOf(TodoTypes),
  handleDoneTodo: PropTypes.func,
  startEditTodo: PropTypes.func,
  deleteTodo: PropTypes.func
}
