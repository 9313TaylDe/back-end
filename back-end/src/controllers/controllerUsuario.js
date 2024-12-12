import {
  getUserId,
  postUser,
  putUser,
  deleteUser,
} from "../services/serviceUsuario";

const GetUserControllerid = (req, res) => {
  getUserId(req, res);
};
const PostUserController = (req, res) => {
  postUser(req, res);
};
const PutUserController = (req, res) => {
  putUser(req, res);
};

const DeleteUserController = (req, res) => {
  deleteUser(req, res);
};

export default {
  GetUserControllerid,
  PostUserController,
  PutUserController,
  DeleteUserController,
};
