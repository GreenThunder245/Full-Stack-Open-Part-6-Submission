import {beforeEach, afterEach, vi, test,expect } from 'vitest'
import { renderHook, act,render, screen, cleanup} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AnecdoteList from './AnecdoteList'
import useAnecdoteStore, {useAnecdoteActions } from '../store'

vi.mock('../services/anecdotes', () => ({
  default: {
    getAll: vi.fn(),
    createNew: vi.fn(),
    update: vi.fn(),
    remove: vi.fn()
  }
}))
import anecdoteService from '../services/anecdotes'

beforeEach(() => {
  useAnecdoteStore.setState({ notes: [], filter: '' })
  vi.clearAllMocks()
})


afterEach(() => {
  cleanup()
})

test('the component displaying anecdotes receives the anecdotes from the store sorted by votes', async () => {
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

  const { result } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await result.current.initialize()
  })
})

test('the correct React component receives a properly filtered list of anecdotes.', async () => {
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

  const { result } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await result.current.initialize()
    await result.current.setFilter('it')
  })

  render(<AnecdoteList />)
  expect(screen.getByText(mockAnecdotes[0].content)).toBeDefined()
  expect(screen.getByText(mockAnecdotes[1].content)).toBeDefined()
  expect(screen.queryByText(mockAnecdotes[2].content)).toBeNull()
})

test('voting increases the number of votes for an anecdote.', async () => {
  const mockAnecdotes = [
    {
      "content": "Adding manpower to a late software project makes it later!",
      "id": "21149",
      "votes": 0
    }
  ]
  anecdoteService.getAll.mockResolvedValue(mockAnecdotes)
  anecdoteService.update.mockResolvedValue({...mockAnecdotes[0], votes : 1})

  const { result } = renderHook(() => useAnecdoteActions())

  await act(async () => {
    await result.current.initialize()
  })

  render(<AnecdoteList />)

  expect(screen.getByText('has 0')).toBeDefined()
  const voteButton = screen.getByRole('button',{ name: 'vote' })
  console.log(voteButton)
  const user = userEvent.setup()
  await user.click(voteButton)
  expect(screen.getByText('has 1')).toBeDefined()
})