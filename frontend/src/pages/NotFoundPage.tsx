import React from 'react'

import { Button, Card } from '@my-app/ui-library'
import { useNavigate } from 'react-router-dom'

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <section className="narrowPage">
      <Card title="404 — Страница не найдена">
        <div className="notFoundBody">
          <p className="mutedText">Запрошенная страница не существует.</p>
          <Button type="button" variant="primary" size="medium" onClick={() => navigate('/')}>
            Вернуться к целям
          </Button>
        </div>
      </Card>
    </section>
  )
}
