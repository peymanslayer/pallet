'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('kilometer_details', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      truckId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      carNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      kilometer: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      totalKilometer: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('kilometer_details');
  },
};
