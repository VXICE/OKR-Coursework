import { useEffect, useState } from 'react'

import type { Goal } from '@my-app/ui-library'

const STORAGE_KEY = 'okr_goals_storage'

const loadStoredGoals = (): Goal[] => {
  const raw = localStorage.getItem(STORAGE_KEY)

  if (!raw) {
    return []
  }

  try {
    const parsed = JSON.parse(raw) as unknown

    if (Array.isArray(parsed)) {
      return parsed as Goal[]
    }

    return []
  } catch {
    return []
  }
}

export interface UseGoalsResult {
  goals: Goal[]
  addGoal: (title: string, deadline: string) => Goal
  addKeyResult: (goalId: number, title: string, target: number) => void
  updateProgress: (goalId: number, krId: number, actualValue: number) => void
  toggleUrgent: (goalId: number) => void
}

export const useGoals = (): UseGoalsResult => {
  const [goals, setGoals] = useState<Goal[]>(loadStoredGoals)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(goals))
  }, [goals])

  const addGoal = (title: string, deadline: string): Goal => {
    const nextId = goals.reduce((maxId, goal) => Math.max(maxId, goal.id), 0) + 1
    const newGoal: Goal = {
      id: nextId,
      title: title.trim(),
      deadline: deadline.trim(),
      keyResults: [],
    }

    setGoals((prev) => [...prev, newGoal])

    return newGoal
  }

  const addKeyResult = (goalId: number, title: string, target: number): void => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        const newKr = {
          id: goal.keyResults.length + 1,
          title: title.trim(),
          target,
          current: 0,
        }

        return {
          ...goal,
          keyResults: [...goal.keyResults, newKr],
        }
      })
    )
  }

  const updateProgress = (goalId: number, krId: number, actualValue: number): void => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        return {
          ...goal,
          keyResults: goal.keyResults.map((kr) => {
            if (kr.id !== krId) {
              return kr
            }

            return {
              ...kr,
              current: actualValue,
            }
          }),
        }
      })
    )
  }

  const toggleUrgent = (goalId: number): void => {
    setGoals((prev) =>
      prev.map((goal) => {
        if (goal.id !== goalId) {
          return goal
        }

        const nextStatus = goal.status === 'urgent' ? undefined : 'urgent'

        return {
          ...goal,
          status: nextStatus,
        }
      })
    )
  }

  return {
    goals,
    addGoal,
    addKeyResult,
    updateProgress,
    toggleUrgent,
  }
}
