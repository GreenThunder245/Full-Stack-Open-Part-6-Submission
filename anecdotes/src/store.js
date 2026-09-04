
import { create } from 'zustand'
import anecdoteService from './services/anecdotes'

const useAnecdoteStore = create(( set, get ) => ({
  anecdotes: [],
  filter: '',
  actions: {
    add: async (content) => {
      const newAnecdote = await anecdoteService.createNew(content)
      set(state => ({ anecdotes: [...state.anecdotes,newAnecdote] }))
    },
    vote: async (id) => {
      const anecdote = get().anecdotes.find(n => n.id === id)
      const updatedAnecdote = await anecdoteService.update(
        id, { ...anecdote, votes: anecdote.votes + 1 }
      )
      set(state => ({
        anecdotes: state.anecdotes.map(n =>  n.id === id ? updatedAnecdote : n)
      }))
    },
    setFilter: text => set( () => ({ filter : text }) ),
    initialize: async () => {
      const anecdotes = await anecdoteService.getAll()
      set(() => ({ anecdotes }))
    },
    remove: async (id) => {
      const removedAnecdote = await anecdoteService.remove(id)
      set(state => ({ anecdotes: state.anecdotes.filter(anecdote => anecdote.id !== removedAnecdote.id) }))
    }
  },
}))


const useNotificationStore = create(( set ) => ({
  message : null,
  actions: {
    setMessage : message => set(() => ({ message: message }))
  }
}))

export default useAnecdoteStore


export const useAnecdotes = () => {
  const anecdotes = useAnecdoteStore((state) => state.anecdotes)
  const filter = useAnecdoteStore((state) => state.filter)
  return anecdotes.filter(n => n.content.includes(filter)).toSorted((a, b) =>  b.votes - a.votes)
}
export const useAnecdoteActions = () => useAnecdoteStore((state) => state.actions)

export const useNotification = () => useNotificationStore((state) => state.message)
export const useNotificationActions = () => useNotificationStore((state) => state.actions)

