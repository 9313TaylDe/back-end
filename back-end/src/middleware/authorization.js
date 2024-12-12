import jwt from "jsonwebtoken";
import respostas from "../responses.js";

function validaToken(req, res, next) {
  // Resgatar o token da requisição
  const retornaToken = req.header("Authorization");

  if (!retornaToken) {
    return respostas.unauthorized(res, "Acesso negado");
  }

  try {
    // Pegar a parte do token após "Bearer "
    const token = retornaToken.split(" ")[1];

    // Verifique se o token está presente
    if (!token) {
      return respostas.unauthorized(res, "Token não encontrado");
    }

    // Decodificar o token
    const tokenDecodado = jwt.verify(token, process.env.KEY_TOKEN);
    req.userId = tokenDecodado.userId;

    next();
  } catch (error) {
    console.log("Erro ao verificar token:", error);
    return respostas.unauthorized(res, "Token inválido");
  }
}
export default validaToken;
