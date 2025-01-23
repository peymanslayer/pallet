'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TruckBreakDownItems', 'question_3', {
      type: Sequelize.DataTypes.TEXT,
      defaultValue: 'اجرت خدمات', 
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TruckBreakDownItems', 'question_3', {
      type: Sequelize.DataTypes.TEXT,
      defaultValue: 'اجرت خدمات', 
      allowNull: true, 
    });
  }
};
