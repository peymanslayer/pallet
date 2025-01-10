'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('KilometerDetails', {
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
          model: 'TruckInfos', // جدول مرجع (TruckInfo)
          key: 'id',          // کلید اصلی جدول مرجع
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      carNumber: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      driverId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Auths', // جدول مرجع (Auth)
          key: 'id',     // کلید اصلی جدول مرجع
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      kilometer: {
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
    await queryInterface.dropTable('KilometerDetails');
  },
};
