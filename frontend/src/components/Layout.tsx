import React from 'react'

import {
  calculateGoalProgress,
  calculateOverallProgress,
  getFilledSquaresCount,
} from '@my-app/ui-library'
import { NavLink, Outlet } from 'react-router-dom'

import type { Goal } from '@my-app/ui-library'

export interface LayoutProps {
  goals: Goal[]
}

const SQUARES_INDICES = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

export const Layout: React.FC<LayoutProps> = ({ goals }) => {
  const overallProgress = calculateOverallProgress(goals)
  const overallSquares = getFilledSquaresCount(overallProgress)
  const completedCount = goals.filter((goal) => calculateGoalProgress(goal) >= 100).length
  const activeCount = goals.length - completedCount

  return (
    <div className="app">
      <header className="appHeader">
        <div className="headerTop">
          <div>
            <h1 className="appTitle">Отслеживание целей OKR</h1>
            <p className="appSubtitle">Управление целями и ключевыми результатами</p>
          </div>
          <nav className="navBar" aria-label="Основная навигация">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
            >
              Активные цели ({activeCount})
            </NavLink>
            <NavLink
              to="/create"
              className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
            >
              Создать цель
            </NavLink>
            <NavLink
              to="/completed"
              className={({ isActive }) => `navLink ${isActive ? 'navLinkActive' : ''}`}
            >
              Выполненные ({completedCount})
            </NavLink>
          </nav>
        </div>

        <div className="overallBox">
          <div className="overallHeader">
            <span className="overallLabel">Общий прогресс по всем целям</span>
            <span className="overallValue">{overallProgress}%</span>
          </div>
          <div className="overallSquares">
            {SQUARES_INDICES.map((index) => {
              const isFilled = index < overallSquares

              return (
                <span
                  key={index}
                  className={`overallSquare ${isFilled ? 'overallSquareFilled' : ''}`}
                />
              )
            })}
          </div>
        </div>
      </header>

      <main className="pageContent">
        <Outlet />
      </main>
    </div>
  )
}
