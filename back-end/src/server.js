import app from "./app.js";
const port = 3000;

app.listen(port, () => {
  console.log(`Rodando no endereço http://localhost:${port}`);
});
