'use strict';

/** @type {import('sequelize-cli').Migration} */
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('TruckBreakDownItems', 'question_34', {
      type: Sequelize.DataTypes.TEXT,
      defaultValue: 'روغن موتور', 
      allowNull: true,
      comment: 'Question 34, e.g., "Oil service"',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'answer_35', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Answer to question 35',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'type_35', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Type of answer for question 35',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'question_35', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'روغن ترمز',
      comment: 'Question 35, e.g., "Oil service"',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'answer_36', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Answer to question 36',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'type_36', {
      type: Sequelize.TEXT,
      allowNull: true,
      comment: 'Type of answer for question 36',
    });

    await queryInterface.addColumn('TruckBreakDownItems', 'question_36', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: 'روغن گیربکس',
      comment: 'Question 36, e.g., "Oil service"',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TruckBreakDownItems', 'question_34');
    await queryInterface.removeColumn('TruckBreakDownItems', 'answer_35');
    await queryInterface.removeColumn('TruckBreakDownItems', 'type_35');
    await queryInterface.removeColumn('TruckBreakDownItems', 'question_35');
    await queryInterface.removeColumn('TruckBreakDownItems', 'answer_36');
    await queryInterface.removeColumn('TruckBreakDownItems', 'type_36');
    await queryInterface.removeColumn('TruckBreakDownItems', 'question_36');
  },
};
