const mongoose = require('mongoose');


const eventSchema = new mongoose.Schema({
  eventName: { type: String, required: true },
  pageUrl: String,
  element: String,
  createdAt: { type: Date, default: Date.now }
});

const visitSchema = new mongoose.Schema({
  visitorId: { type: String, required: true },
  pageUrl: String,
  referrer: String,
  visitedAt: { type: Date, default: Date.now },
  events: [eventSchema] 
});


const mongoSiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  domain: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  visits: [visitSchema]
});

module.exports = mongoose.model('MongoSite', mongoSiteSchema);