'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('visits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      site_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'sites', key: 'id' },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      visitor_id: {
        type: Sequelize.STRING(64),
        allowNull: false
      },
      page_url: {
        type: Sequelize.STRING(500)
      },
      referrer: {
        type: Sequelize.STRING(500)
      },
      user_agent: {
        type: Sequelize.STRING(500)
      },
      visited_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('visits');
  }
};