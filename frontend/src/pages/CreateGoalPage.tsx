import React, { useState } from 'react'

import {
  Button,
  Card,
  isValidDate,
  isValidTitle,
} from '@my-app/ui-library'
import { useNavigate } from 'react-router-dom'

import type { Goal } from '@my-app/ui-library'

export interface CreateGoalPageProps {
  onAddGoal: (title: string, deadline: string) => Goal
}

export const CreateGoalPage: React.FC<CreateGoalPageProps> = ({ onAddGoal }) => {
  const navigate = useNavigate()
  const [goalTitle, setGoalTitle] = useState('')
  const [goalDeadline, setGoalDeadline] = useState('')
  const [goalError, setGoalError] = useState('')

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValidTitle(goalTitle)) {
      setGoalError('Название цели не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')

      return
    }

    if (!isValidDate(goalDeadline)) {
      setGoalError('Неверный формат даты или указана прошедшая дата! Введите дату в формате ДД.ММ.ГГГГ (например, 31.12.2026).')

      return
    }

    const createdGoal = onAddGoal(goalTitle, goalDeadline)

    setGoalTitle('')
    setGoalDeadline('')
    setGoalError('')
    navigate(`/goals/${createdGoal.id}`)
  }

  return (
    <section className="narrowPage">
      <Card title="Добавить новую цель">
        <form onSubmit={handleSubmit} className="form">
          <div className="fieldGroup">
            <label htmlFor="goal-title" className="label">
              Название цели
            </label>
            <input
              id="goal-title"
              type="text"
              className="input"
              placeholder="Например: Выучить английский"
              value={goalTitle}
              onChange={(e) => setGoalTitle(e.target.value)}
            />
          </div>

          <div className="fieldGroup">
            <label htmlFor="goal-deadline" className="label">
              Срок выполнения (ДД.ММ.ГГГГ)
            </label>
            <input
              id="goal-deadline"
              type="text"
              className="input"
              placeholder="31.12.2026"
              value={goalDeadline}
              onChange={(e) => setGoalDeadline(e.target.value)}
            />
          </div>

          {goalError && <div className="errorText">{goalError}</div>}

          <div className="formActions">
            <Button type="submit" variant="primary" size="medium">
              Создать цель
            </Button>
            <Button type="button" variant="secondary" size="medium" onClick={() => navigate('/')}>
              Отмена
            </Button>
          </div>
        </form>
      </Card>
    </section>
  )
}
