import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import usuarioTabela from "../models/UsuarioTabela.js";
import bcrypt from "bcrypt";
import responses from "./responses.js";

dotenv.config();

const Login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const usuario = await usuarioTabela.findOne({
      where: { email: email },
      attributes: ["id", "firstname", "surname", "email", "password"],
    });
    if (!usuario) {
      return responses.unathourized(res, "Email inválido");
    }
    const passwordCorreto = await bcrypt.compare(
      password,
      usuario.dataValues.password
    );

    if (!passwordCorreto) {
      return responses.unathourized(res, "Seha inválida");
    }

    const token = jwt.sign(
      {
        id: usuario.dataValues.id,
        email: usuario.dataValues.email,
      },
      process.env.KEY_TOKEN,
      { expiresIn: "5min" }
    );
    responses.sucess(res, "token criado", token);
  } catch (error) {
    responses.internalServerError(res, "erro ao fazer login");
  }
};

export default Login;
