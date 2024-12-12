"dotenv".config();
import express from "express";
const app = express();
import routerUsuario from "../routes/routeUsuario.js";
import categoriaRoutes from "../routes/routeCategorias.js";
import loginRoutes from "../routes/routeLogin.js";
import prodtuosRoutes from "../routes/routeProdutos.js";
import cors from "cors";

app.use(cors());
app.use(express.json());

// rota padrão para testar as configurações
app.get("/", (req, res) => {
  res.json({
    message: "mensagem de inicio",
  });
});

app.use("/v1/login", loginRoutes);
app.use("/v1/categorias", categoriaRoutes);
app.use("/v1/produtos", prodtuosRoutes);
app.use("/v1/usuarios", routerUsuario);

export default index;
