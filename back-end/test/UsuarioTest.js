import app from "../src/app";
import request from "supertest";
import usuarios from "../src/models/UsuarioTabela.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

let server;
let token;

describe("testes de usuarios", () => {
  jest.mock("../src/models/UsuarioTabela.js");

  beforeAll(async () => {
    server = await app.listen(9004);

    const response = await request(app).post("/v1/user/token").send({
      email: process.env.EMAIL_USER,
      password: process.env.SENHA_USER,
    });
    expect(response.status).toBe(200);
    token = response.body.detalhes;
    expect(token).toBeDefined();
  });
  afterAll(async () => {
    server.close();
  });

  //limpando os mocks
  beforeEach(() => {
    jest.resetAllMocks();
  });

  // teste do metodo GET
  test("Usuario não encontrado", async () => {
    const response = await request(app).get("/v1/usuarios/123");

    expect(response.status).toBe(404);
  });

  test("Usuario  encontrado", async () => {
    const response = await request(app).get("/v1/usuarios/14");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "200",
      mensagem: "Usuario encontrado",
      detalhes: {
        id: 14,
        firstname: "expedito",
        surname: "paulo",
        email: "expedito@example.com",
        password: "hXdeEEGUWM26/zcKer8cC",
      },
    });
  });

  // teste do metodo POST
  test("Tentado cria usuario com email exixtente", async () => {
    const senhaCriptografada = await bcrypt.hash("1357910", 10);

    const response = await request(app)
      .post("/v1/usuarios")
      .set("Authorization", token)
      .send({
        firstname: "Exedito",
        surname: "Paulo",
        email: process.env.EMAIL_USER,
        password: senhaCriptografada,
      });

    expect(response.status).toBe(400);
    console.log(response.body);
    expect(response.body).toEqual({
      status: "400",
      mensagem: "Email,já exite",
    });
  });

  test("Tentado cria usuario com um token invalido", async () => {
    const senhaCriptografada = await bcrypt.hash("1357910", 10);

    const response = await request(app)
      .post("/v1/usuarios")
      .set("Authorization", `tokenInvalido`)
      .send({
        firstname: "Expedito",
        surname: "Paulo",
        email: process.env.EMAIL_USER,
        password: senhaCriptografada,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Tentado cria usuario com um infomação faltando", async () => {
    const senhaCriptografada = await bcrypt.hash("1357910", 10);

    const response = await request(app)
      .post("/v1/usuarios")
      .set("Authorization", token)
      .send({
        firstname: "Expedito",
        surname: "  Paulo",
        password: senhaCriptografada,
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "400",
      mensagem: "os campos são obrigatórios",
    });
  });

  test("Criando um novo usuario", async () => {
    usuarios.create = jest.fn();

    usuarios.create.mockResolvedValue({
      id: 1,
      firstname: "Expedito",
      surname: "Paulo",
      email: "expedito@gmail.com",
      password: await bcrypt.hash("1357910", 10),
    });

    const response = await request(app)
      .post("/v1/usuarios")
      .set("Authorization", token)
      .send({
        firstname: "Expedito",
        surname: "Paulo",
        email: "expedito@gmail.com",
        password: "654321",
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      status: "201",
      mensagem: "usuario criando com sucesso",
      detalhes: {
        firstname: "Expedito",
        surname: "Paulo",
        email: "expedito@gmail.com",
      },
    });
  });

  //Teste do metodo PUT
  test("Atualizando usuario com token invalido", async () => {
    const response = await request(app)
      .put("/v1/usuarios/1")
      .set("Authorization", "tokenInvalido")
      .send({
        firstname: "Expedito",
        surname: "Paulo",
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Atualizando sem enviar informações", async () => {
    const response = await request(app)
      .put("/v1/usuarios/1")
      .set("Authorization", token)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "400",
      mensagem: "todos os campos não podem esta vazio",
    });
  });

  test("Atualizando informações com usuario invalido", async () => {
    const response = await request(app)
      .put("/v1/usuarios/41235")
      .set("Authorization", token)
      .send({
        firstname: "Expedito",
        surname: "Paulo",
      });

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "404",
      mensagem: "Usario não encotrado",
    });
  });

  test("Atualizando sem enviar informações", async () => {
    const response = await request(app)
      .put("/v1/usuarios/1")
      .set("Authorization", token)
      .send({});

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "400",
      mensagem: "todos os campos não podem esta vazio",
    });
  });

  test("Atualizando  informações", async () => {
    usuarios.update = jest.fn();

    usuarios.update.mockResolvedValue({
      firstname: "Expedito",
      surname: "Paulo",
      email: "expedito@gmail.com",
    });

    const response = await request(app)
      .put("/v1/usuarios/22")
      .set("Authorization", token)
      .send({
        firstname: "Expedito",
        surname: "Paulo",
        email: "expedito@gmail.com",
      });

    expect(response.status).toBe(204);
  });

  // Teste metodos de DELET
  test("Deletando usuario sem", async () => {
    const response = await request(app)
      .delete("/v1/usuarios/22")
      .set("Authorization", "tokenInvalido");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Deletando Usuario invalido", async () => {
    const response = await request(app)
      .delete("/v1/usuarios/4321")
      .set("Authorization", token);

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      status: "404",
      mensagem: "Usuario com id= 4321 não foi encotrado",
    });
  });

  test("Deletando Usuario", async () => {
    usuarios.destroy = jest.fn();

    usuarios.destroy.mockResolvedValue(4); // Simula uma deleção bem-sucedida
    const response = await request(app)
      .delete("/v1/usuarios/4")
      .set("Authorization", token);

    expect(response.status).toBe(204);
  });
});
