import { useAnecdotes,useAnecdoteActions,useNotificationActions } from "../store"

const AnecdoteList = () => {
  const anecdotes = useAnecdotes()
  const { vote,remove } = useAnecdoteActions()
  const { setMessage } = useNotificationActions()
  return (
    <div>
        {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => {
              setMessage(`you voted '${anecdote.content}'`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              vote(anecdote.id)
            }}>vote</button>
            {anecdote.votes === 0 && <button onClick={() => {
              setMessage(`you deleted '${anecdote.content}'`)
              setTimeout(() => {
                setMessage(null)
              }, 5000)
              remove(anecdote.id)
            }}>delete</button>}

          </div>
        </div>
      ))}
    </div>
  )
}

export default AnecdoteList