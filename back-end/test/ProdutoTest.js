import request from "supertest";
import app from "../src/app";
import produto from "../src/models/tabelaProdutos";
import imagensProduto from "../src/models/imagensProduto";
import opcoesProduto from "../src/models/opcoesProduto";

const bcrypt = require("bcrypt");

let server;
let token;

// Teste do método GET

describe("Testando a rota de Produtos", () => {
  jest.mock("../src/models/tabelaProdutos");
  jest.mock("../src/models/imagensProduto");
  jest.mock("../src/models/opcoesProduto");

  beforeAll(async () => {
    server = app.listen(9005);
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

  test("Teste do método GET", async () => {
    const response = await request(app).get("/v1/produtos/search");

    expect(response.status).toBe(200);
  });

  test("Teste do metodo GET com dados da requisição  incorretos", async () => {
    const response = await request(app).get("/v1/produtos/search?limit=doze");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      status: "400",
      mensagem: "limit aceita apensa numeros",
    });
  });

  //teste do metodo get por id
  test("Teste do método GET por id", async () => {
    "";
    const response = await request(app).get("/v1/produtos/1");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "200",
      mensagem: "Produto encontrado!",
      detalhes: {
        id: 1,
        enabled: true,
        name: "Produto A",
        slug: "produto-a",
        stock: 10,
        description: "Descrição do Produto A",
        price: 100,
        price_with_discount: 90,
        images: [
          { id: 1, content: "https://store.com/media/product-01/image-01.jpg" },
          { id: 51, content: "base64 da imagem 1" },
          { id: 52, content: "base64 da imagem 2" },
          { id: 53, content: "base64 da imagem 3" },
          { id: 54, content: "base64 da imagem 1" },
          { id: 55, content: "base64 da imagem 2" },
          { id: 56, content: "base64 da imagem 3" },
          { id: 71, content: "base64 da imagem 3" },
        ],
        options: [
          {
            id: 1,
            title: "Tamanho",
            shape: "square",
            radius: 0,
            type: "text",
            values: "Pequeno, Médio, Grande",
          },
          {
            id: 2,
            title: "Cor",
            shape: "circle",
            radius: 0,
            type: "color",
            values: "#F40404, #439580, #4fff",
          },
          {
            id: 21,
            title: "Opção Exemplo 1",
            shape: "square",
            radius: 15,
            type: "text",
            values: "Valor Exemplo 1",
          },
          {
            id: 26,
            title: "Cor",
            shape: "square",
            radius: 4,
            type: "text",
            values: '["PP","GG","M"]',
          },
          {
            id: 27,
            title: "Tamanho",
            shape: "circle",
            radius: null,
            type: "color",
            values: '["#111","#ddd"]',
          },
          {
            id: 28,
            title: "Cor",
            shape: "square",
            radius: 4,
            type: "text",
            values: '["PP","GG","M"]',
          },
          {
            id: 38,
            title: "Cor",
            shape: "square",
            radius: 4,
            type: "text",
            values: '["PP","GG","M"]',
          },
          {
            id: 39,
            title: "Tamanho",
            shape: "circle",
            radius: null,
            type: "color",
            values: '["#111","#ddd"]',
          },
        ],
      },
    });
  });

  test("Teste do método GET por id - Recurso não encontrado", async () => {
    const response = await request(app).get("/v1/produtos/123");

    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      mensagem: "Produto não encontrado!",
      status: "404",
    });
  });

  // Teste do método POST

  test("Teste do método POST dados da requisição estiverem incorretos", async () => {
    const response = await request(app)
      .post("/v1/produtos")
      .set("Authorization", token)
      .send({
        name: "Produto A",
        slug: "produto-a",
      });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({
      mensagem: "Há campos obrigatórios não preenchidos!",
      status: "400",
    });
  });

  test("Tentando criar produto com token inválido", async () => {
    const response = await request(app)
      .post("/v1/produtos")
      .set("Authorization", "tokenInvalido")
      .send({
        name: "Produto A",
        slug: "produto-a",
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Criando um novo produto", async () => {
    // Mock do método create de tabelaProdutos
    produto.create = jest.fn();
    imagensProduto.bulkCreate = jest.fn();
    opcoesProduto.bulkCreate = jest.fn();

    produto.create.mockResolvedValue({
      id: 1,
      enabled: true,
      name: "Produto 01",
      slug: "produto-01",
      stock: 10,
      description: "Descrição do produto 01",
      price: 119.9,
      price_with_discount: 99.9,
      category_ids: [7, 15, 23, 12],
    });

    // Mock do método bulkCreate para imagensProduto e opcoesProduto
    imagensProduto.bulkCreate.mockResolvedValue([
      { id: 1, product_id: 1, path: "path da imagem 1", enabled: true },
      { id: 2, product_id: 1, path: "path da imagem 2", enabled: true },
      { id: 3, product_id: 1, path: "path da imagem 3", enabled: true },
    ]);

    opcoesProduto.bulkCreate.mockResolvedValue([
      {
        id: 1,
        produtos_id: 1,
        title: "Cor",
        shape: "square",
        radius: 4,
        type: "text",
        values: '["PP", "GG", "M"]',
      },
      {
        id: 2,
        produtos_id: 1,
        title: "Tamanho",
        shape: "circle",
        radius: null,
        type: "color",
        values: '["#111", "#ddd"]',
      },
    ]);

    const response = await request(app)
      .post("/v1/produtos")
      .set("Authorization", token)
      .send({
        enabled: true,
        name: "Produto 01",
        slug: "produto-01",
        stock: 10,
        description: "Descrição do produto 01",
        price: 129.9,
        price_with_discount: 100.9,
        category_ids: [, 15, 24, 68],
        images: [
          {
            type: "image/png",
            content: "path da imagem 1",
          },
          {
            type: "image/png",
            content: "path da imagem 2",
          },
          {
            type: "image/jpg",
            content: "path da imagem 3",
          },
        ],
        options: [
          {
            title: "Cor",
            shape: "square",
            radius: "4px",
            type: "text",
            values: ["PP", "GG", "M"],
          },
          {
            title: "Tamanho",
            shape: "circle",
            type: "color",
            values: ["#111", "#ddd"],
          },
        ],
      });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Produto criado com sucesso!",
      status: "201",
    });

    // Verifique se o create foi chamado corretamente
    expect(response.status).toBe(201);
    expect(response.body).toEqual({
      mensagem: "Produto criado com sucesso!",
      status: "201",
    });
  });

  // Teste do método PUT
  test("Atualizando produto com token invalido", async () => {
    const response = await request(app)
      .put("/v1/produtos/20")
      .set("Authorization", "tokenInvalido")
      .send({
        enabled: true,
        name: "Produto 01",
        slug: "produto-01",
        stock: 10,
      });

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Atualizando produto", async () => {
    produto.update = jest.fn();

    produto.update.mockResolvedValue([1]);

    const response = await request(app)
      .put("/v1/produtos/20")
      .set("Authorization", token)
      .send({
        enabled: true,
        name: "Produto 01",
        slug: "produto-01",
        stock: 10,
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: "200",
      mensagem: "Produto atualizado com sucesso!",
    });
  });

  // Teste do método DELETE
  test("Deletando produto com token inválido", async () => {
    const response = await request(app)
      .delete("/v1/produtos/20")
      .set("Authorization", "tokenInvalido");

    expect(response.status).toBe(401);
    expect(response.body).toEqual({
      status: "401",
      mensagem: "Token invalido",
    });
  });

  test("Deletando produto", async () => {
    produto.destroy = jest.fn();
    produto.destroy.mockResolvedValue(1);

    const response = await request(app)
      .delete("/v1/produtos/7")
      .set("Authorization", token);

    expect(response.status).toBe(204);
  });
});
