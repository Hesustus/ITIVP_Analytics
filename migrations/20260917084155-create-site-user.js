'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('site_users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      site_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      added_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });

    // Уникальность пары (user_id, site_id)
    await queryInterface.addConstraint('site_users', {
      fields: ['user_id', 'site_id'],
      type: 'unique',
      name: 'site_users_user_id_site_id_unique'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('site_users');
  }
};