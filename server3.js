require('dotenv').config();

const express = require('express');
const { Event, User, sequelize } = require('./models');

const authMiddleware = require('./middleware/auth');
const csrfMiddleware = require('./middleware/csrf');
const authRoutes = require('./routes/auth');

const app = express();
app.use(express.json());


app.use('/auth', authRoutes);

app.use(authMiddleware);

app.use(csrfMiddleware);

app.get('/profile', async (req, res, next) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'email', 'name', 'created_at']
    });
    if (!user) {
      return res.status(404).json({ error: 'Пользователь не найден' });
    }
    res.json(user);
  } catch (err) {
    next(err);
  }
});


app.get('/events', async (req, res, next) => {
  try {
    const events = await Event.findAll();
    res.json(events);
  } catch (err) {
    next(err);
  }
});

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

app.put('/events/:id', async (req, res, next) => {
  try {
    const { visitId, eventName, pageUrl, element } = req.body;

    const [updated] = await Event.update(
      { visitId, eventName, pageUrl, element },
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


app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});


app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});


const port = 5500;

app.listen(port, () => {
      console.log(`Server running on http://localhost:${port}`);
    });