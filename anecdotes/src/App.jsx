import AnecdoteForm from './components/AnecdoteForm.jsx'
import AnecdoteList from './components/AnecdoteList'
import Filter from './components/Filter'
import Notification from './components/Notification.jsx'
import { useAnecdoteActions, useNotification } from './store.js'
import { useEffect } from 'react'
const App = () => {
  const { initialize } = useAnecdoteActions()
  const message = useNotification()

  useEffect(() => {
    initialize()
  }, [initialize])

  return (
    <div>
      <h2>Anecdotes</h2>
      <Notification message={message}/>
      <Filter />
      <AnecdoteList />
      <AnecdoteForm />
    </div>
  )
}

export default App
