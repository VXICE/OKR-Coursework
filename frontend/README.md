# Отслеживание целей OKR — Веб-приложение (`frontend`)

Основное одностраничное React-приложение (TypeScript + Vite + React Router), использующее локальную библиотеку общих компонентов `@my-app/ui-library`.

Полное описание архитектуры и MVP находится в корне репозитория:
- [`../architecture.md`](../architecture.md)
- [`../mvp.md`](../mvp.md)

## Страницы и маршруты

- `/` (`GoalsPage`) — список активных целей (`прогресс < 100%`)
- `/create` (`CreateGoalPage`) — форма создания новой цели с валидацией
- `/goals/:id` (`GoalDetailsPage`) — страница конкретной цели с формой добавления ключевых результатов
- `/completed` (`CompletedGoalsPage`) — список выполненных целей (`100%`)
- `*` (`NotFoundPage`) — страница 404

## Запуск и проверка

Перед первым запуском соберите библиотеку в `../ui-library` (`npm install && npm run build`).

```bash
npm install
npm run lint
npm run test:coverage
npm run build
npm run dev
```
