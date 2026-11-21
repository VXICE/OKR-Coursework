import React from 'react'

import {
  KeyResultList,
  OkrGoalCard,
  calculateGoalProgress,
} from '@my-app/ui-library'
import { Link } from 'react-router-dom'

import type { Goal } from '@my-app/ui-library'

export interface CompletedGoalsPageProps {
  goals: Goal[]
  onProgressChange: (goalId: number, krId: number, actualValue: number) => void
  onToggleUrgent: (goalId: number) => void
}

export const CompletedGoalsPage: React.FC<CompletedGoalsPageProps> = ({
  goals,
  onProgressChange,
  onToggleUrgent,
}) => {
  const completedGoals = goals.filter((goal) => calculateGoalProgress(goal) >= 100)

  return (
    <section className="goalsColumn">
      <h2 className="sectionTitle">Выполненные цели ({completedGoals.length})</h2>

      {completedGoals.length === 0 ? (
        <div className="emptyGoals">
          <p>Выполненных целей пока нет. Когда прогресс цели достигнет 100%, она появится здесь.</p>
        </div>
      ) : (
        completedGoals.map((goal) => {
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
                    Открыть цель →
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
