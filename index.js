// index.js
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

let transactions = [];

// Get all transactions
app.get("/transactions", (req, res) => {
  res.json(transactions);
});

// Add transaction
app.post("/transactions", (req, res) => {
  const { id, title, amount, type, date } = req.body;
  transactions.push({ id, title, amount, type, date });
  res.json({ message: "Transaction added" });
});

// Edit transaction
app.put("/transactions/:id", (req, res) => {
  const { id } = req.params;
  const { title, amount, type, date } = req.body;
  transactions = transactions.map((t) =>
    t.id === id ? { ...t, title, amount, type, date } : t
  );
  res.json({ message: "Transaction updated" });
});

// Delete transaction
app.delete("/transactions/:id", (req, res) => {
  const { id } = req.params;
  transactions = transactions.filter((t) => t.id !== id);
  res.json({ message: "Transaction deleted" });
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
