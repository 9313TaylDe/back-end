"use strict";
import { Sequelize } from "sequelize";

export default {
  up: async (queryInterface) => {
    await queryInterface.createTabele("Users", {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      firstname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      surname: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updateAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable("Users");
  },
};
