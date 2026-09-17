'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {          // ← было 'Users'
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      email: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true   
      },
      name: {
        type: Sequelize.STRING(100)
      },
      created_at: {  
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('NOW()')
      }
      // updatedAt убрали — в вашей схеме его нет
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('users');
  }
};