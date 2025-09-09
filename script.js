const form = document.getElementById("transactionForm");
const transactionList = document.getElementById("transactionList");
let transactions = [];

const API_URL = "http://localhost:5000/transactions";

// Fetch transactions from server
async function fetchTransactions() {
  const res = await fetch(API_URL);
  transactions = await res.json();
  renderTransactions();
  renderChart();
}

// Render transaction list
function renderTransactions() {
  transactionList.innerHTML = "";
  transactions.forEach((t) => {
    const li = document.createElement("li");
    li.className = t.type;
    li.innerHTML = `
      ${t.title} - ₹${t.amount} (${t.type}) - ${t.date}
      <div>
        <button onclick="editTransaction('${t.id}')">Edit</button>
        <button onclick="deleteTransaction('${t.id}')">Delete</button>
      </div>
    `;
    transactionList.appendChild(li);
  });
}

// Add transaction
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newTransaction = {
    id: Date.now().toString(),
    title: document.getElementById("title").value,
    amount: Number(document.getElementById("amount").value),
    type: document.getElementById("type").value,
    date: document.getElementById("date").value,
  };
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newTransaction),
  });
  form.reset();
  fetchTransactions();
});

// Delete transaction
async function deleteTransaction(id) {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
  fetchTransactions();
}

// Edit transaction
async function editTransaction(id) {
  const t = transactions.find((t) => t.id === id);
  const title = prompt("Title:", t.title);
  const amount = prompt("Amount:", t.amount);
  const type = prompt("Type (income/expense):", t.type);
  const date = prompt("Date (YYYY-MM-DD):", t.date);
  if (title && amount && type && date) {
    await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, amount: Number(amount), type, date }),
    });
    fetchTransactions();
  }
}

// Chart
let chart;
function renderChart() {
  const monthlyData = {};
  transactions.forEach((t) => {
    const month = t.date.split("-")[1];
    if (!monthlyData[month]) monthlyData[month] = { income: 0, expense: 0 };
    monthlyData[month][t.type] += t.amount;
  });

  const labels = Object.keys(monthlyData);
  const income = labels.map((m) => monthlyData[m].income);
  const expense = labels.map((m) => monthlyData[m].expense);

  const ctx = document.getElementById("barChart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        { label: "Income", data: income, backgroundColor: "#28a745" },
        { label: "Expense", data: expense, backgroundColor: "#dc3545" },
      ],
    },
    options: { responsive: true },
  });
}

fetchTransactions();
