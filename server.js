const express = require('express');
const { Event, Visit, sequelize } = require('./models');

const app = express();
app.use(express.json());

// GET /events — все события
app.get('/events', async (req, res, next) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

// GET /events/:id — одно событие
app.get('/events/:id', async (req, res, next) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// POST /events — создать
app.post('/events', async (req, res, next) => {
  try {
    const { visitId, eventName, pageUrl, element } = req.body;

    if (!visitId || !eventName) {
      return res.status(400).json({
        error: 'Необходимо указать visitId и eventName'
      });
    }

    const event = await Event.create({ visitId, eventName, pageUrl, element });
    res.status(201).json(event);
  } catch (err) {
    if (err.name === 'SequelizeForeignKeyConstraintError') {
      return res.status(400).json({ error: 'Указанный visitId не существует' });
    }
    next(err);
  }
});

// PUT /events/:id — обновить
app.put('/events/:id', async (req, res, next) => {
  try {
    const { visitId, eventName, pageUrl } = req.body;

    const [updated] = await Event.update(
      { visitId, eventName, pageUrl },
      { where: { id: req.params.id } }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    const event = await Event.findByPk(req.params.id);
    res.json(event);
  } catch (err) {
    next(err);
  }
});

// DELETE /events/:id — удалить
app.delete('/events/:id', async (req, res, next) => {
  try {
    const deleted = await Event.destroy({
      where: { id: req.params.id }
    });

    if (!deleted) {
      return res.status(404).json({ error: 'Событие не найдено' });
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

// Обработчик ошибок
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

const port = 5500;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));