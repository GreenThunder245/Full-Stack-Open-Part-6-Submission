import { useQuery, useMutation ,useQueryClient} from '@tanstack/react-query'
import { getAnecdotes, createAnecdote, updateAnecdote, } from '../services/anecdotes'
import useNotify from "./useNotify"

export const useAnecdotes = () => {
  const queryClient = useQueryClient()
  const { SetTemporaryMessage } = useNotify()

  const result = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    refetchOnWindowFocus: false,
    retry: 1
  })

  const newAnecdoteMutation = useMutation({
    mutationFn: createAnecdote,
    onError: () => {
      SetTemporaryMessage('too short anecdote, must have length 5 or more')
    },
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.concat(newAnecdote))
      SetTemporaryMessage(`anecdote '${newAnecdote.content}' created`)
    }
  })

  const updateAnecdoteMutation = useMutation({
    mutationFn: updateAnecdote,
    onError: () => {

    },
    onSuccess: (updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(
        anecdote =>  anecdote.id === updatedAnecdote.id ? updatedAnecdote : anecdote
      ))
      SetTemporaryMessage(`anecdote '${updatedAnecdote.content}' voted`)
    }
  })

  return {
    anecdotes: result.data,
    isPending: result.isPending,
    isError: result.isError,
    addAnecdote: (content) => newAnecdoteMutation.mutate(content),
    vote: (anecdote) => updateAnecdoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }
}
