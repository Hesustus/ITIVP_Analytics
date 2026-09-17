'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SiteUser extends Model {
    static associate(models) {
      SiteUser.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'user'
      });
      SiteUser.belongsTo(models.Site, {
        foreignKey: 'siteId',
        as: 'site'
      });
    }
  }

  SiteUser.init({
    userId: { type: DataTypes.INTEGER, allowNull: false },
    siteId: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'SiteUser',
    tableName: 'site_users',
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    createdAt: 'added_at',
    updatedAt: false
  });

  return SiteUser;
};