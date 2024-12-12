import sequelize from "../config/conexao";
import { DataTypes } from "sequelize";
import Produtos from "./tabelaProdutos";

const ImagensProduto = sequelize.define("imagensProdutos", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Produtos,
      key: "id",
    },
    onDelete: "CASCADE",
  },
  enabled: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  path: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
    onUpdate: DataTypes.NOW,
  },
});

ImagensProduto.belongsTo(Produtos, { as: "produto", foreignKey: "product_id" });
Produtos.hasMany(ImagensProduto, {
  as: "imagensProdutos",
  foreignKey: "product_id",
});

sequelize
  .sync()
  .then(() => {
    console.log("Tabelas imagensProduto sincronizadas.");
  })
  .catch((err) => {
    console.error("Erro ao sincronizar tabelas:", err);
  });

export default ImagensProduto;
