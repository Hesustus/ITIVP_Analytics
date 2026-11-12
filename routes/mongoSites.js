const express = require('express');
const router = express.Router();
const MongoSite = require('../mongo-models/MongoSite');

router.get('/', async (req, res, next) => {
  try {
    const sites = await MongoSite.find();
    res.json(sites);
  } catch (err) { next(err); }
});

router.get('/:id', async (req, res, next) => {
  try {
    const site = await MongoSite.findById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Not found' });
    res.json(site);
  } catch (err) { next(err); }
});

router.post('/', async (req, res, next) => {
  try {
    const { name, domain } = req.body;
    const site = await MongoSite.create({ name, domain, visits: [] });
    res.status(201).json(site);
  } catch (err) { next(err); }
});

router.put('/:id', async (req, res, next) => {
  try {
    const site = await MongoSite.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true } 
    );
    res.json(site);
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await MongoSite.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (err) { next(err); }
});

router.post('/:id/visits', async (req, res, next) => {
  try {
    const site = await MongoSite.findById(req.params.id);
    if (!site) return res.status(404).json({ error: 'Not found' });

    site.visits.push({
      visitorId: req.body.visitorId,
      pageUrl: req.body.pageUrl,
      referrer: req.body.referrer
    });

    await site.save();
    res.status(201).json(site);
  } catch (err) { next(err); }
});


router.post('/:id/visits/:visitId/events', async (req, res, next) => {
  try {
    const site = await MongoSite.findOneAndUpdate(
      { _id: req.params.id, 'visits._id': req.params.visitId },
      {
        $push: {
          'visits.$.events': {
            eventName: req.body.eventName,
            pageUrl: req.body.pageUrl,
            element: req.body.element
          }
        }
      },
      { new: true }
    );

    if (!site) return res.status(404).json({ error: 'Not found' });
    res.status(201).json(site);
  } catch (err) { next(err); }
});

module.exports = router;