import React from 'react'

import {
  Button,
  KeyResultList,
  OkrGoalCard,
  calculateGoalProgress,
} from '@my-app/ui-library'
import { Link, useNavigate } from 'react-router-dom'

import type { Goal } from '@my-app/ui-library'

export interface GoalsPageProps {
  goals: Goal[]
  onProgressChange: (goalId: number, krId: number, actualValue: number) => void
  onToggleUrgent: (goalId: number) => void
}

export const GoalsPage: React.FC<GoalsPageProps> = ({
  goals,
  onProgressChange,
  onToggleUrgent,
}) => {
  const navigate = useNavigate()
  const activeGoals = goals.filter((goal) => calculateGoalProgress(goal) < 100)

  return (
    <section className="goalsColumn">
      <div className="pageHeaderRow">
        <h2 className="sectionTitle">Активные цели ({activeGoals.length})</h2>
        <Button type="button" variant="primary" size="small" onClick={() => navigate('/create')}>
          Новая цель
        </Button>
      </div>

      {activeGoals.length === 0 ? (
        <div className="emptyGoals">
          <p>У вас пока нет активных целей. Создайте первую цель, чтобы начать отслеживать прогресс.</p>
          <div className="emptyActions">
            <Button type="button" variant="primary" size="medium" onClick={() => navigate('/create')}>
              Создать цель
            </Button>
          </div>
        </div>
      ) : (
        activeGoals.map((goal) => {
          const goalProg = calculateGoalProgress(goal)

          return (
            <OkrGoalCard
              key={goal.id}
              title={`${goal.id}. ${goal.title}`}
              deadline={goal.deadline}
              progress={goalProg}
              status={goal.status}
              onToggleUrgent={() => onToggleUrgent(goal.id)}
            >
              <div className="goalCardBody">
                <KeyResultList
                  keyResults={goal.keyResults}
                  onProgressChange={(krId, val) => onProgressChange(goal.id, krId, val)}
                />
                <div className="goalCardFooter">
                  <Link to={`/goals/${goal.id}`} className="detailsLink">
                    Открыть цель и добавить KR →
                  </Link>
                </div>
              </div>
            </OkrGoalCard>
          )
        })
      )}
    </section>
  )
}
