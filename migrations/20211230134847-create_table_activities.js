"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("activities", {
      id: {
        type: Sequelize.STRING(25),
        primaryKey: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      title: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP()")
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP() ON UPDATE CURRENT_TIMESTAMP()")
      },
      deleted_at: {
        type: Sequelize.TEXT,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("activities");
  },
};
