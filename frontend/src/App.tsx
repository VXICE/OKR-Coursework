import '@my-app/ui-library/style.css'
import { Route, Routes } from 'react-router-dom'

import './App.css'
import { Layout } from './components/Layout'
import { useGoals } from './hooks/useGoals'
import { CompletedGoalsPage } from './pages/CompletedGoalsPage'
import { CreateGoalPage } from './pages/CreateGoalPage'
import { GoalDetailsPage } from './pages/GoalDetailsPage'
import { GoalsPage } from './pages/GoalsPage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  const {
    goals,
    addGoal,
    addKeyResult,
    updateProgress,
    toggleUrgent,
  } = useGoals()

  return (
    <Routes>
      <Route path="/" element={<Layout goals={goals} />}>
        <Route
          index
          element={(
            <GoalsPage
              goals={goals}
              onProgressChange={updateProgress}
              onToggleUrgent={toggleUrgent}
            />
          )}
        />
        <Route
          path="create"
          element={<CreateGoalPage onAddGoal={addGoal} />}
        />
        <Route
          path="goals/:id"
          element={(
            <GoalDetailsPage
              goals={goals}
              onAddKeyResult={addKeyResult}
              onProgressChange={updateProgress}
              onToggleUrgent={toggleUrgent}
            />
          )}
        />
        <Route
          path="completed"
          element={(
            <CompletedGoalsPage
              goals={goals}
              onProgressChange={updateProgress}
              onToggleUrgent={toggleUrgent}
            />
          )}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
