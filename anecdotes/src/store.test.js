import {it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act} from '@testing-library/react'

vi.mock('./services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))

import anecdoteService from './services/anecdotes'
import useAnecdoteStore, { useAnecdotes, useAnecdoteActions } from './store'

beforeEach(() => {
  useAnecdoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})

it('the state is initialized with the anecdotes returned by the backend', async () => {
  const mockAnecdotes = [
    {
      "content": "If it hurts, do it more often",
      "id": "47145",
      "votes": 0
    },
    {
      "content": "Adding manpower to a late software project makes it later!",
      "id": "21149",
      "votes": 0
    }
  ]
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

  const { result } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await result.current.initialize()
  })

  const { result: notesResult } = renderHook(() => useAnecdotes())
  expect(notesResult.current).toEqual(mockAnecdotes)
})

// it('the component displaying anecdotes receives the anecdotes from the store sorted by votes.', async () => {
//   const mockAnecdotes = [
//     {
//       "content": "If it hurts, do it more often",
//       "id": "47145",
//       "votes": 1
//     },
//     {
//       "content": "Adding manpower to a late software project makes it later!",
//       "id": "21149",
//       "votes": 0
//     },
//     {
//       "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//       "id": "69581",
//       "votes": 2
//     },
//   ]
//   anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

//   const { result } = renderHook(() => useAnecdoteActions())

//   await act(async () => {
//     await result.current.initialize()
//   })

//   const { result: notesResult } = renderHook(() => useAnecdotes())
//   expect(notesResult.current[0]).toEqual(mockAnecdotes[2])
//   expect(notesResult.current[1]).toEqual(mockAnecdotes[0])
//   expect(notesResult.current[2]).toEqual(mockAnecdotes[1])
// })

// it('the correct React component receives a properly filtered list of anecdotes.', async () => {
//   const mockAnecdotes = [
//     {
//       "content": "If it hurts, do it more often",
//       "id": "47145",
//       "votes": 1
//     },
//     {
//       "content": "Adding manpower to a late software project makes it later!",
//       "id": "21149",
//       "votes": 0
//     },
//     {
//       "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
//       "id": "69581",
//       "votes": 2
//     },
//   ]
//   anecdoteService.getAll.mockResolvedValue(mockAnecdotes)

//   const { result } = renderHook(() => useAnecdoteActions())

//   await act(async () => {
//     await result.current.initialize()
//     await result.current.setFilter('it')
//   })

//   const { result: notesResult } = renderHook(() => useAnecdotes())
//   expect(notesResult.current).toEqual([mockAnecdotes[0],mockAnecdotes[1]])
// })

it('voting increases the number of votes for an anecdote.', async () => {
  const mockAnecdotes = [
    {
      "content": "If it hurts, do it more often",
      "id": "47145",
      "votes": 1
    },
    {
      "content": "Adding manpower to a late software project makes it later!",
      "id": "21149",
      "votes": 0
    },
    {
      "content": "The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
      "id": "69581",
      "votes": 2
    },
  ]
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
  anecdoteService.update.mockResolvedValue({...mockAnecdotes[0], votes : 3})

  const { result } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await result.current.initialize()
    await result.current.vote('21149')
  })

  const { result: notesResult } = renderHook(() => useAnecdotes())
  console.log(notesResult.current)

  expect(notesResult.current[0].votes).toEqual(3)
})