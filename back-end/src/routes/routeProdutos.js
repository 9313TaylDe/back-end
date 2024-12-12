import authorization from "../middleware/authorization.js";
import express, { Router } from "express";
import {
  GetProdutosController,
  GetProdutosControllerId,
  PostProdutosController,
  PutProdutosController,
  DeleteProdutosController,
} from "../controllers/controllerCategoria.js";

const produtoRoute = express.Router();

produtoRoute.get("/search", GetProdutosController);

produtoRoute.get("/:id", GetProdutosControllerId);

produtoRoute.post("/", authorization, PostProdutosController);

produtoRoute.put("/:id", authorization, PutProdutosController);

produtoRoute.delete("/:id", authorization, DeleteProdutosController);

export default produtoRoute;
