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
      unique: true,
      allowNull: false,
      validate: { isEmail: true }
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    passwordHash: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'password_hash'
    },
    csrfToken: {
      type: DataTypes.STRING(255),
      allowNull: true,
      field: 'csrf_token'
    }
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