const express = require('express');
const { Op } = require('sequelize');
const { Site, Visit, Event, sequelize } = require('../models');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;
    const search = (req.query.search || '').trim();

    const where = search
      ? {
          [Op.or]: [
            { name:   { [Op.iLike]: `%${search}%` } },
            { domain: { [Op.iLike]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows } = await Site.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      distinct: true,
      include: [{
        model: Visit,
        as: 'visits',
        include: [{ model: Event, as: 'events' }]
      }]
    });

    res.json({
      data: rows,
      total: count,
      page,
      limit,
      totalPages: Math.ceil(count / limit)
    });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const site = await Site.findByPk(req.params.id, {
      include: [{
        model: Visit,
        as: 'visits',
        include: [{ model: Event, as: 'events' }]
      }]
    });
    if (!site) return res.status(404).json({ error: 'Сайт не найден' });
    res.json(site);
  } catch (err) {
    next(err);
  }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, domain } = req.body;
    if (!name || !domain) {
      return res.status(400).json({ error: 'name и domain обязательны' });
    }
    const site = await Site.create({ name, domain });
    res.status(201).json({ ...site.toJSON(), visits: [] });
  } catch (err) {
    next(err);
  }
});

router.put('/:id', async (req, res, next) => {
  try {
    const { name, domain } = req.body;
    const [updated] = await Site.update(
      { name, domain },
      { where: { id: req.params.id } }
    );
    if (!updated) return res.status(404).json({ error: 'Сайт не найден' });

    const site = await Site.findByPk(req.params.id, {
      include: [{
        model: Visit, as: 'visits',
        include: [{ model: Event, as: 'events' }]
      }]
    });
    res.json(site);
  } catch (err) {
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Site.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ error: 'Сайт не найден' });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

module.exports = router;