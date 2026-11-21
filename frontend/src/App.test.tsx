import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'

import App from './App'

const renderWithRouter = (initialPath = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
    </MemoryRouter>
  )
}

describe('App Routing and OKR Flows', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  test('renders empty active goals page on "/" and navigates to "/create"', () => {
    renderWithRouter('/')

    expect(screen.getByText('Отслеживание целей OKR')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Активные цели (0)' })).toBeInTheDocument()
    expect(
      screen.getByText('У вас пока нет активных целей. Создайте первую цель, чтобы начать отслеживать прогресс.')
    ).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Создать цель' }))
    expect(screen.getByText('Добавить новую цель')).toBeInTheDocument()
  })

  test('validates goal creation, redirects to "/goals/:id", adds KR, updates progress and moves to "/completed"', () => {
    renderWithRouter('/create')

    const createBtn = screen.getByRole('button', { name: 'Создать цель' })

    fireEvent.click(createBtn)
    expect(
      screen.getByText('Название цели не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')
    ).toBeInTheDocument()

    const titleInput = screen.getByLabelText('Название цели')
    const deadlineInput = screen.getByLabelText('Срок выполнения (ДД.ММ.ГГГГ)')

    fireEvent.change(titleInput, { target: { value: 'Выучить английский' } })
    fireEvent.change(deadlineInput, { target: { value: 'неверная дата' } })
    fireEvent.click(createBtn)

    expect(
      screen.getByText('Неверный формат даты или указана прошедшая дата! Введите дату в формате ДД.ММ.ГГГГ (например, 31.12.2026).')
    ).toBeInTheDocument()

    fireEvent.change(deadlineInput, { target: { value: '31.12.2028' } })
    fireEvent.click(createBtn)

    expect(screen.getByRole('heading', { name: '1. Выучить английский' })).toBeInTheDocument()

    const addKrBtn = screen.getByRole('button', { name: 'Добавить ключевой результат' })

    fireEvent.click(addKrBtn)
    expect(
      screen.getByText('Описание не должно быть пустым, длиннее 100 символов или начинаться со слэша (/).')
    ).toBeInTheDocument()

    const krTitleInput = screen.getByLabelText('Краткое описание ключевого результата')
    const krTargetInput = screen.getByLabelText('Целевое значение (больше 0)')

    fireEvent.change(krTitleInput, { target: { value: 'Изучить Past Simple' } })
    fireEvent.change(krTargetInput, { target: { value: '0' } })
    fireEvent.click(addKrBtn)
    expect(screen.getByText('Целевое значение должно быть числом больше 0.')).toBeInTheDocument()

    fireEvent.change(krTargetInput, { target: { value: '5' } })
    fireEvent.click(addKrBtn)

    expect(screen.getByText('1. Изучить Past Simple')).toBeInTheDocument()

    const urgentBtn = screen.getByRole('button', { name: 'Сделать срочным' })

    fireEvent.click(urgentBtn)
    expect(screen.getByText('Срочное')).toBeInTheDocument()

    const slider = screen.getByLabelText('Ползунок прогресса для Изучить Past Simple')

    fireEvent.change(slider, { target: { value: '5' } })
    expect(screen.getByText('Выполнено')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('link', { name: 'Выполненные (1)' }))
    expect(screen.getByRole('heading', { name: '1. Выучить английский' })).toBeInTheDocument()
  })

  test('renders goal not found state on invalid "/goals/:id" route', () => {
    renderWithRouter('/goals/999')

    expect(screen.getByText('Цель не найдена')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Вернуться к списку целей' }))
    expect(screen.getByRole('heading', { name: 'Активные цели (0)' })).toBeInTheDocument()
  })

  test('renders 404 page on unknown route and navigates home', () => {
    renderWithRouter('/non-existent-route')

    expect(screen.getByText('404 — Страница не найдена')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Вернуться к целям' }))
    expect(screen.getByRole('heading', { name: 'Активные цели (0)' })).toBeInTheDocument()
  })

  test('loads persisted goals from localStorage on "/" and "/completed"', () => {
    localStorage.setItem(
      'okr_goals_storage',
      JSON.stringify([
        {
          id: 1,
          title: 'Завершенная цель',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR1', target: 5, current: 5 }],
        },
        {
          id: 2,
          title: 'Активная цель',
          deadline: '31.12.2028',
          keyResults: [{ id: 1, title: 'KR2', target: 1000, current: 999 }],
        },
      ])
    )

    renderWithRouter('/')

    expect(screen.getByRole('heading', { name: '2. Активная цель' })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: '1. Завершенная цель' })).not.toBeInTheDocument()
    expect(screen.getByText('выполнено 999 из 1000 (99%)')).toBeInTheDocument()
  })
})
