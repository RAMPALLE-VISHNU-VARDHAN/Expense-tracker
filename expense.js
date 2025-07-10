// Utility to get today's date in yyyy-mm-dd
function todayStr() {
  const d = new Date();
  return d.toISOString().slice(0, 10);
}

// Load or initialize data
let expenses = JSON.parse(localStorage.getItem('expenses') || '[]');
let limit = Number(localStorage.getItem('limit') || 0);

const limitForm = document.getElementById('limit-form');
const limitInput = document.getElementById('limit-input');
const limitInfo = document.getElementById('limit-info');
const expenseForm = document.getElementById('expense-form');
const amountInput = document.getElementById('amount');
const categoryInput = document.getElementById('category');
const descInput = document.getElementById('desc');
const dateInput = document.getElementById('date');
const expenseList = document.getElementById('expense-list');
const summaryDiv = document.getElementById('summary');
const alertDiv = document.getElementById('alert');

// Set today's date as default
dateInput.value = todayStr();

function saveData() {
  localStorage.setItem('expenses', JSON.stringify(expenses));
  localStorage.setItem('limit', limit);
}

function renderLimit() {
  if (limit > 0) {
    limitInfo.textContent = `Your daily limit: ₹${limit}`;
  } else {
    limitInfo.textContent = 'No daily limit set.';
  }
}

function renderExpenses() {
  // Show only today's expenses
  const today = todayStr();
  let todaysExpenses = expenses.filter(e => e.date === today);
  // Only show the 20 most recent
  if (todaysExpenses.length > 20) {
    todaysExpenses = todaysExpenses.slice(-20);
  }
  expenseList.innerHTML = '';
  let total = 0;
  const categoryTotals = {};
  todaysExpenses.forEach(e => {
    total += Number(e.amount);
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + Number(e.amount);
    const li = document.createElement('li');
    li.innerHTML = `<span><b>₹${e.amount}</b> - ${e.category} (${e.desc})</span><span>${e.date}</span>`;
    expenseList.appendChild(li);
  });
  // Summary
  let summary = `<b>Total spent today:</b> ₹${total}<br>`;
  summary += '<b>By category:</b><br>';
  for (const cat in categoryTotals) {
    summary += `${cat}: ₹${categoryTotals[cat]}<br>`;
  }
  summaryDiv.innerHTML = summary;

  // Alert if over limit
  if (limit > 0 && total > limit) {
    alertDiv.textContent = `Alert! You have exceeded your daily limit by ₹${total - limit}`;
    alertDiv.style.display = 'block';
  } else {
    alertDiv.style.display = 'none';
  }
}

limitForm.addEventListener('submit', e => {
  e.preventDefault();
  limit = Number(limitInput.value);
  saveData();
  renderLimit();
  renderExpenses();
  limitInput.value = '';
});

expenseForm.addEventListener('submit', e => {
  e.preventDefault();
  const expense = {
    amount: Number(amountInput.value),
    category: categoryInput.value,
    desc: descInput.value,
    date: dateInput.value
  };
  expenses.push(expense);
  saveData();
  renderExpenses();
  amountInput.value = '';
  categoryInput.value = '';
  descInput.value = '';
  dateInput.value = todayStr();
});

renderLimit();
renderExpenses(); 