import express from "express";
import authorization from "../middleware/authorization.js";
import {
  getCategoria,
  getCategoriaId,
  postCategoria,
  putCategoria,
  deleteCategoria,
} from "../controllers/controllerCategoria";

const categoriasRoute = express.Router();

categoriasRoute.get("/search", getCategoria);
categoriasRoute.get("/:id", getCategoriaId);
categoriasRoute.post("/", authorization, postCategoria);
categoriasRoute.put("/:id", authorization, putCategoria);
categoriasRoute.delete("/:id", authorization, deleteCategoria);

export default categoriasRoute;
