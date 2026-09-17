'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Visit extends Model {
    static associate(models) {
      Visit.belongsTo(models.Site, {
        foreignKey: 'siteId',
        as: 'site'
      });

      Visit.hasMany(models.Event, {
        foreignKey: 'visitId',
        as: 'events'
      });
    }
  }

  Visit.init({
    siteId: { type: DataTypes.INTEGER, allowNull: false },
    visitorId: { type: DataTypes.STRING(64), allowNull: false },
    pageUrl: DataTypes.STRING(500),
    referrer: DataTypes.STRING(500),
    userAgent: DataTypes.STRING(500)
  }, {
    sequelize,
    modelName: 'Visit',
    tableName: 'visits',
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    createdAt: 'visited_at',
    updatedAt: false
  });

  return Visit;
};