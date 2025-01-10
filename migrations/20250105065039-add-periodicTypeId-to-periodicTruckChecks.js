'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('PeriodicTruckChecks', 'periodicTypeId', {
      type: Sequelize.INTEGER,
      allowNull: true,  // این می‌تواند به false تغییر یابد اگر بخواهید که مقدار null نداشته باشد
      references: {
        model: 'PeriodicTypes',  // جدول مرجع
        key: 'id'  // کلید اصلی جدول مرجع
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('PeriodicTruckChecks', 'periodicTypeId');
  }
};
