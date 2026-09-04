import { create } from 'zustand'

const useFeedback = create((set) => ({
  good: 0,
  neutral: 0,
  bad: 0,
  actions: {
    incrementGood: () => set(state => ({ good: state.good + 1 })),
    incrementNeutral: () => set(state => ({ neutral: state.neutral + 1 })),
    incrementBad: () => set(state => ({ bad: state.bad + 1 })),
  }
}))

export const useFeedbackGood = () => useFeedback(state => state.good)
export const useFeedbackNeutral = () => useFeedback(state => state.neutral)
export const useFeedbackBad = () => useFeedback(state => state.bad)

export const useFeedbackControls = () => useFeedback(state => state.actions)