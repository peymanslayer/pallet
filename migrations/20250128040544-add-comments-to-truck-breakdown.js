'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('TruckBreakDowns', 'hoursLogisticComment', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('TruckBreakDowns', 'historyLogisticComment', {
      type: Sequelize.STRING,
      allowNull: true,
    });
    await queryInterface.addColumn('TruckBreakDowns', 'hoursTransportComment', {
      type: Sequelize.STRING,
      allowNull: true, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('TruckBreakDowns', 'hoursLogisticComment');
    await queryInterface.removeColumn('TruckBreakDowns', 'historyLogisticComment');
    await queryInterface.removeColumn('TruckBreakDowns', 'hoursTransportComment');
  }
};