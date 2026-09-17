'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsToMany(models.Site, {
        through: models.SiteUser,
        foreignKey: 'userId',
        otherKey: 'siteId',
        as: 'sites'
      });
    }
  }

  User.init({
    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: true
    },
    name: DataTypes.STRING(100)
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    underscored: true,
    underscoredAll: true,
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  return User;
};