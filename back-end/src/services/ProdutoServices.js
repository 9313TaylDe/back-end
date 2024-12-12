import Op from "sequelize";
import app from "../app.js";
import respostas from "../responses.js";
import produtoTabela from "../models/ProdutoTabela.js";
import imagesProduto from "../models/ImageProduto.js";
import opcoesProduto from "../models/OpcoesProduto.js";

const getProduct = async (req, res) => {
  try {
    const {
      limit = 12,
      page = 1,
      fields,
      match,
      category_ids,
      price_range,
      option = {},
    } = req.query;

    if (isNaN(Number(limit))) {
      return responses.badRequest(res, "Limit aceitando só números");
    }
    let queryOptions = {
      include: [
        {
          model: opcoesProduto,
          as: "opcoesProduto",
        },
        {
          model: imagesProduto,
          as: "imagensProduto",
          required: false,
        },
      ],
    };

    let where = {};

    let queryLimit = parseInt(limit);
    if (queryLimit === -1) {
      queryLimit = null;
    } else if (isNaN(queryLimit) || queryLimit <= 0) {
      queryLimit = 12;
    }
    const querySets =
      queryLimit !== -1 ? (parseInt(page) - 1) * queryLimit : null;

    if (fields) {
      queryOptions.attibutes = fields.split(",");
    }

    if (price_range) {
      const [miniPrice, maxiPrice] = price_range
        .split("-")
        .map((price) => parseFloat(price));
      if (isNaN(miniPrice) && !isNaN(maxiPrice)) {
        where.price = { [Op.between]: [miniPrice, maxiPrice] };
      }
    }

    if (category_ids) {
      const categoryIdsArrays = category_ids
        .split(",")
        .map((id) => parseInt(id));
      where.categoryId = { [Op.in]: categoryIdsArrays };
    }

    if (match) {
      where[Op.or] = [
        { name: { [Op.like]: `%${match}` } },
        { description: { [Op.like]: `%${match}` } },
      ];
    }

    if (Object.keys(option).length > 0) {
      const optionFilters = [];
      for (const [key, value] of Object.entries(option)) {
        const Arraysval = value.split(",");
        optionFilters.push({
          [`options.${key}`]: { [Op.in]: Arraysval },
        });
      }
      where[Option.and] = optionFilters;
    }

    queryOptions.where = where;
    queryOptions.limit = queryLimit;
    queryOptions.offset = querySets;

    const produtos = await produtoTabela.findAll(queryOptions);

    if (produtos.length === 0) {
      return responses.notFound(res, "Nenhum produto encontrado!");
    }

    const responsesFomatted = {
      data: produtos.map((produto) => ({
        id: produto.id,
        enabled: produto.enabled,
        name: produto.name,
        slug: produto.slug,
        stock: produto.stock,
        description: produto.description,
        price: produto.price,
        price_with_discount: produto.price_with_discount,
        category_ids: produto.category_ids,
        images: produto.imagensProdutos.map((image) => ({
          id: image.id,
          content: image.path,
        })),
        options: produto.opcoesProduto.map((option) => ({
          id: option.id,
          title: option.title,
          shape: option.shape,
          radius: option.radius,
          type: option.type,
          values: option.values,
        })),
      })),
      total: produtos.length,
      limit: queryLimit,
      page: parseInt(page),
    };
    return responses.sucess(res, "Produtos encontrados!", responsesFomatted);
  } catch (error) {
    return responses.internalServerError(
      res,
      "Ocorreu um erro ao buscar os produtos"
    );
  }
};

const getProductId = async (req, res) => {
  try {
    const { id } = req.params;
    const queryOptions = {
      include: [
        {
          model: opcoesProduto,
          as: "opcoesProduto",
        },
        {
          model: imagesProduto,
          as: "imagensProduto",
          required: false,
        },
      ],
    };
    const produto = await produtoTabela.findByPk(id, queryOptions);
    if (!produto) {
      return responses.notFound(res, "Nenhum produto encontrado!");
    }
    const responsesFomatted = {
      id: produto.id,
      enabled: produto.enabled,
      name: produto.name,
      slug: produto.slug,
      stock: produto.stock,
      description: produto.description,
      price: produto.price,
      price_with_discount: produto.price_with_discount,
      category_ids: produto.category_ids,
      images: produto.imagensProdutos.map((image) => ({
        id: image.id,
        content: image.path,
      })),
      options: produto.opcoesProduto.map((option) => ({
        id: option.id,
        title: option.title,
        shape: option.shape,
        radius: option.radius,
        type: option.type,
        values: option.values,
      })),
    };
    return respostas.success(res, "Produto encontrado!", formattedResponse);
  } catch (error) {
    return responses.internalServerError(
      res,
      "Ocorreu um erro ao buscar o produto"
    );
  }
};

const postProduct = async (req, res) => {
  const {
    enabled,
    name,
    slug,
    use_in_menu,
    stock,
    description,
    price,
    price_with_disccount,
    category_ids,
    imags,
    options,
  } = req.body;

  const camposObrigatorios = { name, slug, price, price_with_disccount };

  const camposFaltando = Object.keys(camposObrigatorios).filter(
    (key) => !camposObrigatorios[key]
  );

  if (camposFaltando.length > 0) {
    return responses.badRequest(
      res,
      "Há campos obrigatórios sem preenchimento"
    );
  }

  try {
    const createProduto = await tabelaProdutos.create({
      enabled,
      name,
      slug,
      use_in_menu,
      stock,
      description,
      price,
      price_with_disccount,
      category_ids: JSON.stringify(category_ids),
    });

    console.log("Produto criado com sucesso:", createProduto);

    // Cria as imagens relacionadas
    if (images && images.length > 0) {
      const imagensData = images.map((image) => ({
        product_id: createProduto.id,
        path: image.content,
        enabled: true,
      }));
      await imagensProduto.bulkCreate(imagensData);
      console.log("Imagens criadas com sucesso:", imagensData);
    }

    // Cria as opções relacionadas
    if (options && options.length > 0) {
      const opcoesData = options.map((option) => ({
        produtos_id: createProduto.id,
        title: option.title,
        shape: option.shape,
        radius: option.radius ? parseFloat(option.radius) : null,
        type: option.type,
        values: JSON.stringify(option.values || []),
      }));
      await opcoesProduto.bulkCreate(opcoesData);
      console.log("Opções criadas com sucesso:", opcoesData);
    }

    return respostas.created(res, "Produto criado com sucesso!");
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return respostas.badRequest(res, "Ocorreu um erro na criação do produto.");
  }
};

const putProduct = async (req, res) => {
  const { id } = req.params.id;
  const {
    enabled,
    name,
    slug,
    use_in_menu,
    stock,
    description,
    price,
    price_with_discount,
    category_ids,
    images,
    options,
  } = req.body;

  if (
    !enabled &&
    !name &&
    !slug &&
    !use_in_menu &&
    !options &&
    !category_ids &&
    !images &&
    !price_with_discount &&
    !description
  ) {
    return responses.badRequest(
      res,
      "Um campo ao menos deve ser preenchdigo para que o produto seja atualizado"
    );
  }
  try {
    const produto = await produtoTabela.findByPk(id);
    if (!produto) return responses.notFound(res, "Produto não encontrado");

    await produtoTabela.update(
      {
        enabled,
        name,
        slug,
        use_in_menu,
        stock,
        description,
        price,
        price_with_discount,
      },
      {
        where: { id: id },
      }
    );

    if (images && images.length > 0) {
      await Promise.all(
        images.map(async (img) => {
          if (img.id) {
            await imagesProduto.update(
              {
                enabled: img.deleted,
                path: img.content,
              },
              { where: { id: img.id } }
            );
          } else {
            console.log("ID da imagem nçao fornecido: ", img);
          }
        })
      );
    }
    if (options && options.length > 0) {
      await Promise.all(
        options.map(async (opt) => {
          if (opt.id) {
            const radius = isNaN(opt.radius) ? 0 : opt.radius;
            await opcoesProduto.update(
              {
                title: opt.title,
                shape: opt.shape,
                radius: radius,
                type: opt.type,
                values: JSON.stringify(opt.values), // Convertendo para string
              },
              { where: { id: opt.id } }
            );
          } else {
            console.log("ID da opção não fornecido:", opt);
          }
        })
      );
    }

    return respostas.success(res, "Produto atualizado com sucesso!");
  } catch (error) {
    console.error("Erro ao atualizar produto:", error);
    return respostas.InternalServerError(
      res,
      `Ocorreu um erro na atualização do produto: ${error.message}`
    );
  }
};

const deleteProduct = async (req, res) => {
  const id = req.params.id;

  if (!id) {
    return responses.badRequest(res, "ID do produto  não fornecida");
  }

  try {
    await opcoesProduto.destroy({ where: { produtos_id: id } });
    await imagesProduto.destroy({ where: { produtos_id: id } });

    const produto = await produtoTabela.destroy({
      where: { id: id },
    });

    if (!produto) {
      return responses.notFound(res, `Produto não encontrado: ", id=${id}`);
    }
  } catch (error) {
    return responses.InternalServerError(
      res,
      "Ocorreu um erro ao deleter um produto"
    );
  }
};

export default {
  getProduct,
  getProductId,
  putProduct,
  postProduct,
  deleteProduct,
};
