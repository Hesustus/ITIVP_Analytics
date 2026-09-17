'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      visit_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'visits', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      event_name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      page_url: {
        type: Sequelize.STRING(500)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events');
  }
};