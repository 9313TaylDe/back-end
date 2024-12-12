import dotenv from "dotenv";
import cors from "cors";
import express from "express";

dotenv.config();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Mensagem de inicio",
  });
});

export default app;
