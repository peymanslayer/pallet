'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Kilometers', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      truckId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TruckInfos', 
          key: 'id',          
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currenrKilometer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      previousKilometer: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Kilometers');
  },
};

