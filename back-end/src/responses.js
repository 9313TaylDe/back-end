const responses = {
  sucess: (res, mensagem, detalhes) => {
    res.status(200).json({
      status: "200",
      mensagem: mensagem,
      detalhes: detalhes,
    });
  },

  created: (res, mensagem, detalhes) => {
    res.status(201).json({
      status: "201",
      mensagem: mensagem,
      detalhes: detalhes,
    });
  },

  noContent: (res) => {
    res.status(204).json({ status: "204" });
  },

  badRequest: (res, mensagem) => {
    res.status(400).json({
      status: "400",
      mensagem: mensagem,
    });
  },

  notFound: (res, mensagem) => {
    res.status(404).json({
      status: "404",
      mensagem: mensagem,
    });
  },

  unathourized: (res, mensagem) => {
    res.status(401).json({
      status: "401",
      mensagem: mensagem,
    });
  },

  internalServerError: (res, mensagem) => {
    res.status(500);
    json({
      status: "500",
      mensagem: mensagem,
    });
  },
};

export default responses;
