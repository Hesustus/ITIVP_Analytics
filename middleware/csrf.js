const { User } = require('../models');

module.exports = async function (req, res, next) {
  // GET, HEAD, OPTIONS — безопасные методы, не проверяем
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }

  // auth-эндпоинты не требуют CSRF (нет токена до логина)
  if (req.path.startsWith('/auth')) {
    return next();
  }

  // Нужен аутентифицированный пользователь
  if (!req.user || !req.user.id) {
    return res.status(401).json({ error: 'Требуется авторизация' });
  }

  const headerToken = req.headers['x-csrf-token'];
  if (!headerToken) {
    return res.status(403).json({ error: 'Отсутствует CSRF-токен' });
  }

  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['csrfToken']
    });
    if (!user || user.csrfToken !== headerToken) {
      return res.status(403).json({ error: 'Невалидный CSRF-токен' });
    }
    next();
  } catch (err) {
    next(err);
  }
};