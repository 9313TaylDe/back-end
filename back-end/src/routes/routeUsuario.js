import {
  GetUserControllerid,
  PostUserController,
  PutUserController,
  DeleteUserController,
} from "../controllers/contollerUsuarios";

import express from "express";
import authorization from "../middleware/authorization.js";
const usuarioRoute = express.Router();

usuarioRoute.get("/:id", (req, res) => {
  GetUserControllerid(req, res);
});

usuarioRoute.post("/", authorization, (req, res) => {
  PostUserController(req, res);
});

usuarioRoute.put("/:id", authorization, (req, res) => {
  PutUserController(req, res);
});

usuarioRoute.delete("/:id", authorization, (req, res) => {
  DeleteUserController(req, res);
});

export default usuarioRoute;
