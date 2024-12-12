import express from "express";
import userLogin from "../controllers/controllerLogin.js";

const usuarioRute = express.Router();

usuarioRute.post("/token", (req, res) => {
  userLogin(req, res);
});
