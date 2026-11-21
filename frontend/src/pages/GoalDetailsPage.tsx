import React, { useState } from 'react'

import {
  Button,
  Card,
  KeyResultList,
  OkrGoalCard,
  calculateGoalProgress,
  isPositiveNumber,
  isValidId,
  isValidTitle,
} from '@my-app/ui-library'
import { Link, useNavigate, useParams } from 'react-router-dom'

import type { Goal } from '@my-app/ui-library'

export interface GoalDetailsPageProps {
  goals: Goal[]
  onAddKeyResult: (goalId: number, title: string, target: number) => void
  onProgressChange: (goalId: number, krId: number, actualValue: number) => void
  onToggleUrgent: (goalId: number) => void
}

export const GoalDetailsPage: React.FC<GoalDetailsPageProps> = ({
  goals,
  onAddKeyResult,
  onProgressChange,
  onToggleUrgent,
}) => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [krTitle, setKrTitle] = useState('')
  const [krTarget, setKrTarget] = useState('')
  const [krError, setKrError] = useState('')

  const numericGoalId = id && isValidId(id) ? Number(id) : null
  const goal = numericGoalId !== null ? goals.find((g) => g.id === numericGoalId) : undefined

  if (!goal) {
    return (
      <section className="narrowPage">
        <Card title="Цель не найдена">
          <div className="notFoundBody">
            <p className="mutedText">Цель с указанным номером отсутствует.</p>
            <Button type="button" variant="primary" size="medium" onClick={() => navigate('/')}>
              Вернуться к списку целей
            </Button>
          </div>
        </Card>
      </section>
    )
  }

  const goalProg = calculateGoalProgress(goal)

  const handleAddKeyResult = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!isValidTitle(krTitle)) {
      setKrError('Описание не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')

      return
    }

    if (!isPositiveNumber(krTarget)) {
      setKrError('Целевое значение должно быть числом больше 0.')

      return
    }

    onAddKeyResult(goal.id, krTitle, Number(krTarget))
    setKrTitle('')
    setKrTarget('')
    setKrError('')
  }

  return (
    <section className="detailsPage">
      <div className="pageHeaderRow">
        <Link to="/" className="backLink">
          ← Назад к активным целям
        </Link>
      </div>

      <div className="detailsLayout">
        <OkrGoalCard
          title={`${goal.id}. ${goal.title}`}
          deadline={goal.deadline}
          progress={goalProg}
          status={goal.status}
          onToggleUrgent={() => onToggleUrgent(goal.id)}
        >
          <KeyResultList
            keyResults={goal.keyResults}
            onProgressChange={(krId, val) => onProgressChange(goal.id, krId, val)}
          />
        </OkrGoalCard>

        <Card title="Привязать ключевой результат">
          <form onSubmit={handleAddKeyResult} className="form">
            <div className="fieldGroup">
              <label htmlFor="kr-title" className="label">
                Краткое описание ключевого результата
              </label>
              <input
                id="kr-title"
                type="text"
                className="input"
                placeholder="Например: Изучить Past Simple"
                value={krTitle}
                onChange={(e) => setKrTitle(e.target.value)}
              />
            </div>

            <div className="fieldGroup">
              <label htmlFor="kr-target" className="label">
                Целевое значение (больше 0)
              </label>
              <input
                id="kr-target"
                type="number"
                className="input"
                placeholder="5"
                value={krTarget}
                onChange={(e) => setKrTarget(e.target.value)}
              />
            </div>

            {krError && <div className="errorText">{krError}</div>}

            <Button type="submit" variant="primary" size="medium">
              Добавить ключевой результат
            </Button>
          </form>
        </Card>
      </div>
    </section>
  )
}
