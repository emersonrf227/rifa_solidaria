const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

app.use(express.json());
app.use(express.static("public"));

const FILE = "vendidos.json";

function getVendidos() {
  if (!fs.existsSync(FILE)) {
    fs.writeFileSync(FILE, JSON.stringify([]));
  }

  return JSON.parse(fs.readFileSync(FILE));
}

function saveVendidos(data) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2));
}

app.get("/api/vendidos", (req, res) => {
  res.json(getVendidos());
});

app.get("/api/marcar/:numero", (req, res) => {
  const numero = req.params.numero;

  let vendidos = getVendidos();

  if (!vendidos.includes(numero)) {
    vendidos.push(numero);
  }

  saveVendidos(vendidos);

  res.json({
    success: true,
    vendidos,
  });
});

app.get("/api/desmarcar/:numero", (req, res) => {
  const numero = req.params.numero;

  let vendidos = getVendidos();

  vendidos = vendidos.filter((n) => n !== numero);

  saveVendidos(vendidos);

  res.json({
    success: true,
    vendidos,
  });
});

app.listen(3000, () => {
  console.log("Servidor rodando em http://localhost:3000");
});