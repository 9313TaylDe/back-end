import express from "express";
import {
  getProductID,
  postProduct,
  putProduct,
  deleteProducts,
  getProduct,
} from "../services/ProdutosServices.js";

const GetProdutosController = (req, res) => {
  getProduct(req, res);
};

const GetProdutosControllerId = (req, res) => {
  getProductID(req, res);
};

const PostProdutosController = (req, res) => {
  postProduct(req, res);
};

const PutProdutosController = (req, res) => {
  putProduct(req, res);
};
const DeleteProdutosController = (req, res) => {
  deleteProducts(req, res);
};

export default {
  GetProdutosController,
  GetProdutosControllerId,
  PostProdutosController,
  PutProdutosController,
  DeleteProdutosController,
};
