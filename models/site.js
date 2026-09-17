'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Site extends Model {
    static associate(models) {

      Site.belongsToMany(models.User, {
        through: models.SiteUser,
        foreignKey: 'siteId',
        otherKey: 'userId',
        as: 'users'
      });


      Site.hasMany(models.Visit, {
        foreignKey: 'siteId',
        as: 'visits'
      });
    }
  }

  Site.init({
    name: { type: DataTypes.STRING(100), allowNull: false },
    domain: { type: DataTypes.STRING(255), allowNull: false }
  }, {
    sequelize,
    modelName: 'Site',
    tableName: 'sites',
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return Site;
};