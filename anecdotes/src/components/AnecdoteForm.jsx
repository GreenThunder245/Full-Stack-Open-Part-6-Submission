import { useAnecdoteActions, useNotificationActions } from "../store"

const AnecdoteForm = () => {
  const { add } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()
  
  const addAnecdote = (e) => {
    e.preventDefault()
    console.log(e.target)
    const content = e.target.anecdote.value
    setMessage(`you created the anecdote '${content}'`)
    setTimeout(() => {
      setMessage(null)
    }, 5000)
    add(content)
    e.target.reset()
  }
  return (
    <div>
      <h2>create new</h2>
      <form  onSubmit={addAnecdote}>
        <div>
          <input name="anecdote" data-testid="new" />
        </div>
        <button type="submit">create</button>
      </form>
    </div>
  )
}
export default AnecdoteForm