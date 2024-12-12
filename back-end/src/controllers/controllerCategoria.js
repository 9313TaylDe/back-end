import CategoriaServices from "../services/CategoriaServices.js";
import categoriasTabela from "../models/CategoriaTabela.js";

const getCategoria = (req, res) => {
  CategoriaServices.getCategoria(req, res, categoriasTabela);
};
const getCategoriaId = (req, res) => {
  CategoriaServices.getCategoriaId(req, res, categoriasTabela);
};

const postCategoria = (req, res) => {
  CategoriaServices.postCategoria(req, res, categoriasTabela);
};
const putCategoria = (req, res) => {
  CategoriaServices.putCategoria(req, res, categoriasTabela);
};
const deleteCategoria = (req, res) => {
  CategoriaServices.deleteCategoria(req, res, categoriasTabela);
};

export default {
  getCategoria,
  getCategoriaId,
  postCategoria,
  putCategoria,
  deleteCategoria,
};
