// 20231130123456-create-user.js (em src/seeders)
import bcrypt from "bcrypt";

export default {
  up: async (queryInterface) => {
    const hashedPassword = await bcrypt.hash("password123", 10);
    await queryInterface.bulkInsert(
      "users", // Nome da tabela
      [
        {
          firstname: "John",
          surname: "Doe",
          email: "john.doe@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          firstname: "Jane",
          surname: "Smith",
          email: "jane.smith@example.com",
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete("users", null, {});
  },
};
