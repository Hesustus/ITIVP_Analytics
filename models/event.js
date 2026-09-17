'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    static associate(models) {
      Event.belongsTo(models.Visit, {
        foreignKey: 'visitId',
        as: 'visit'
      });
    }
  }

  Event.init({
    visitId: { type: DataTypes.INTEGER, allowNull: false },
    eventName: { type: DataTypes.STRING(100), allowNull: false },
    pageUrl: DataTypes.STRING(500), 
    element: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'events',
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Event;
};