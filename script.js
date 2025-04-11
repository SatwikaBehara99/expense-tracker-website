let salary = +localStorage.getItem("salary") || 0;
let savings = +localStorage.getItem("savings") || 0;
let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
let goals = JSON.parse(localStorage.getItem("goals")) || [];

function saveSalary() {
  const val = +document.getElementById("salaryInput").value;
  localStorage.setItem("salary", val);
  salary = val;
  updateUI();
}

function saveSavings() {
  const val = +document.getElementById("savingsInput").value;
  localStorage.setItem("savings", val);
  savings = val;
  updateUI();
}

function addExpense() {
  const name = document.getElementById("expenseName").value;
  const amt = +document.getElementById("expenseAmount").value;
  if (!name || !amt) return;
  expenses.push({ name, amt });
  localStorage.setItem("expenses", JSON.stringify(expenses));
  updateUI();
}

function addBudgetGoal() {
  const name = document.getElementById("goalName").value;
  const amt = +document.getElementById("goalAmount").value;
  if (!name || !amt) return;
  goals.push({ name, amt });
  localStorage.setItem("goals", JSON.stringify(goals));
  showGoals();
}

function updateUI() {
  const expenseTotal = expenses.reduce((sum, e) => sum + e.amt, 0);
  const balance = salary - savings - expenseTotal;

  const s = id => document.getElementById(id);
  if (s("salaryAmount")) s("salaryAmount").textContent = salary;
  if (s("savingsAmount")) s("savingsAmount").textContent = savings;
  if (s("balanceAmount")) s("balanceAmount").textContent = balance;

  if (s("monthlyIncome")) s("monthlyIncome").textContent = salary;
  if (s("monthlySavings")) s("monthlySavings").textContent = savings;
  if (s("monthlyExpenses")) s("monthlyExpenses").textContent = expenseTotal;

  if (s("summarySalary")) s("summarySalary").textContent = salary;
  if (s("summarySavings")) s("summarySavings").textContent = savings;
  if (s("summaryExpenses")) s("summaryExpenses").textContent = expenseTotal;

  if (s("expenseHistory")) {
    s("expenseHistory").innerHTML = "<h3>Expense History</h3>";
    expenses.forEach(e => {
      const p = document.createElement("p");
      p.textContent = `${e.name}: ₹${e.amt}`;
      s("expenseHistory").appendChild(p);
    });
  }

  if (s("summaryList")) {
    s("summaryList").innerHTML = "<h3>Expenses:</h3>";
    expenses.forEach(e => {
      const p = document.createElement("p");
      p.textContent = `${e.name} - ₹${e.amt}`;
      s("summaryList").appendChild(p);
    });
  }

  if (s("expenseChart")) drawChart();
}

function showGoals() {
  const list = document.getElementById("goalList");
  if (!list) return;
  list.innerHTML = "";
  goals.forEach(goal => {
    const p = document.createElement("p");
    p.textContent = `${goal.name} Goal: ₹${goal.amt}`;
    list.appendChild(p);
  });
}

function drawChart() {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  if (window.pieChart) window.pieChart.destroy();
  window.pieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: ["Savings", "Expenses", "Balance"],
      datasets: [{
        data: [
          savings,
          expenses.reduce((sum, e) => sum + e.amt, 0),
          salary - savings - expenses.reduce((sum, e) => sum + e.amt, 0)
        ],
        backgroundColor: ["#ffc107", "#dc3545", "#28a745"]
      }]
    }
  });
}

function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
}

window.onload = () => {
  updateUI();
  showGoals();
};
