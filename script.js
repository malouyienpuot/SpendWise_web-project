// SpendWise: interactive budget and expense tracker
const STORAGE_KEYS = { expenses: "spendwise-expenses", budget: "spendwise-monthly-budget" };
const DEFAULT_BUDGET = 20000;
const CURRENCY = new Intl.NumberFormat("en-KE", { style: "currency", currency: "KES", maximumFractionDigits: 2 });

let expenses = loadExpenses();
let monthlyBudget = loadBudget();

const elements = {
  budgetValue: document.getElementById("budget-value"),
  spentValue: document.getElementById("spent-value"),
  remainingValue: document.getElementById("remaining-value"),
  remainingFoot: document.getElementById("remaining-foot"),
  countValue: document.getElementById("count-value"),
  budgetInput: document.getElementById("budget-input"),
  budgetForm: document.getElementById("budget-form"),
  expenseForm: document.getElementById("expense-form"),
  description: document.getElementById("expense-description"),
  amount: document.getElementById("expense-amount"),
  category: document.getElementById("expense-category"),
  date: document.getElementById("expense-date"),
  expenseList: document.getElementById("expense-list"),
  monthFilter: document.getElementById("month-filter"),
  progress: document.getElementById("budget-progress"),
  progressPercent: document.getElementById("progress-percent"),
  progressLimit: document.getElementById("progress-limit"),
  budgetMessage: document.getElementById("budget-message"),
  categoryBreakdown: document.getElementById("category-breakdown"),
  tableFooter: document.getElementById("table-footer"),
  monthLabel: document.getElementById("month-label"),
  todayLabel: document.getElementById("today-label"),
  toast: document.getElementById("toast")
};

function loadExpenses() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEYS.expenses));
    return Array.isArray(saved) ? saved.filter(item =>
      item && typeof item.id === "string" && typeof item.description === "string" &&
      Number.isFinite(Number(item.amount)) && typeof item.category === "string" &&
      typeof item.date === "string"
    ) : [];
  } catch (error) {
    console.warn("Could not load saved expenses:", error);
    return [];
  }
}

function loadBudget() {
  const saved = Number(localStorage.getItem(STORAGE_KEYS.budget));
  return Number.isFinite(saved) && saved > 0 ? saved : DEFAULT_BUDGET;
}

function saveData() {
  localStorage.setItem(STORAGE_KEYS.expenses, JSON.stringify(expenses));
  localStorage.setItem(STORAGE_KEYS.budget, String(monthlyBudget));
}

function money(amount) {
  return CURRENCY.format(amount);
}

function getCurrentMonthExpenses() {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  return expenses.filter(expense => {
    const date = new Date(`${expense.date}T00:00:00`);
    return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
  });
}

function getVisibleExpenses() {
  if (elements.monthFilter.value === "all") return [...expenses];
  return getCurrentMonthExpenses();
}

function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("show");
  window.clearTimeout(showToast.timeoutId);
  showToast.timeoutId = window.setTimeout(() => elements.toast.classList.remove("show"), 2600);
}

function renderSummary() {
  const currentExpenses = getCurrentMonthExpenses();
  let totalSpent = 0;

  // Loop through this month's records to calculate the total.
  for (const expense of currentExpenses) {
    totalSpent += Number(expense.amount);
  }

  const remaining = monthlyBudget - totalSpent;
  const percentage = monthlyBudget > 0 ? (totalSpent / monthlyBudget) * 100 : 0;

  elements.budgetValue.textContent = money(monthlyBudget);
  elements.spentValue.textContent = money(totalSpent);
  elements.remainingValue.textContent = money(remaining);
  elements.countValue.textContent = String(currentExpenses.length);
  elements.remainingFoot.textContent = remaining < 0 ? "You are over your monthly budget" : "Available within your budget";
  elements.monthLabel.textContent = new Date().toLocaleDateString("en-KE", { month: "long", year: "numeric" });
  elements.progressLimit.textContent = `${money(monthlyBudget)} limit`;
  elements.progressPercent.textContent = `${Math.round(percentage)}% used`;
  elements.progress.style.width = `${Math.min(percentage, 100)}%`;
  elements.progress.classList.toggle("warning", percentage >= 70 && percentage <= 100);
  elements.progress.classList.toggle("over", percentage > 100);

  // Conditional statements give feedback based on the user's budget position.
  elements.budgetMessage.className = "budget-message";
  if (totalSpent === 0) {
    elements.budgetMessage.textContent = "You have not recorded any spending this month. Add an expense to get started.";
  } else if (remaining < 0) {
    elements.budgetMessage.textContent = `You have exceeded your budget by ${money(Math.abs(remaining))}. Review your spending and adjust where possible.`;
    elements.budgetMessage.classList.add("over");
  } else if (percentage >= 70) {
    elements.budgetMessage.textContent = `You have used ${Math.round(percentage)}% of your budget. Keep an eye on your remaining ${money(remaining)}.`;
    elements.budgetMessage.classList.add("warning");
  } else {
    elements.budgetMessage.textContent = `Good work! You are within budget, with ${money(remaining)} available.`;
  }
}

function renderTransactions() {
  const visibleExpenses = getVisibleExpenses().sort((a, b) => b.date.localeCompare(a.date));
  elements.expenseList.replaceChildren();

  if (visibleExpenses.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 5;
    cell.className = "empty-state";
    cell.textContent = elements.monthFilter.value === "all"
      ? "No expenses yet. Add your first expense above."
      : "No expenses recorded this month.";
    row.appendChild(cell);
    elements.expenseList.appendChild(row);
  } else {
    // Build one table row for every expense in the array.
    for (const expense of visibleExpenses) {
      const row = document.createElement("tr");
      const descriptionCell = document.createElement("td");
      descriptionCell.textContent = expense.description;

      const categoryCell = document.createElement("td");
      const tag = document.createElement("span");
      tag.className = "category-tag";
      tag.textContent = expense.category;
      categoryCell.appendChild(tag);

      const dateCell = document.createElement("td");
      const date = new Date(`${expense.date}T00:00:00`);
      dateCell.textContent = date.toLocaleDateString("en-KE", { day: "numeric", month: "short", year: "numeric" });

      const amountCell = document.createElement("td");
      amountCell.className = "amount-cell";
      amountCell.textContent = money(Number(expense.amount));

      const actionCell = document.createElement("td");
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "delete-button";
      deleteButton.textContent = "×";
      deleteButton.setAttribute("aria-label", `Delete ${expense.description}`);
      deleteButton.addEventListener("click", () => deleteExpense(expense.id));

      actionCell.appendChild(deleteButton);
      row.append(descriptionCell, categoryCell, dateCell, amountCell, actionCell);
      elements.expenseList.appendChild(row);
    }
  }

  elements.tableFooter.textContent = `Showing ${visibleExpenses.length} transaction${visibleExpenses.length === 1 ? "" : "s"}`;
}

function renderCategories() {
  const totals = {};
  const currentExpenses = getCurrentMonthExpenses();

  // Group records by category and add their amounts.
  for (const expense of currentExpenses) {
    if (!totals[expense.category]) totals[expense.category] = 0;
    totals[expense.category] += Number(expense.amount);
  }

  elements.categoryBreakdown.replaceChildren();
  const categories = Object.entries(totals).sort((a, b) => b[1] - a[1]);
  if (categories.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-small";
    empty.textContent = "Your category summary will appear here.";
    elements.categoryBreakdown.appendChild(empty);
    return;
  }

  const largest = categories[0][1];
  for (const [category, total] of categories) {
    const row = document.createElement("div");
    row.className = "category-row";
    const name = document.createElement("span");
    name.className = "category-name";
    name.textContent = category;
    const track = document.createElement("div");
    track.className = "category-track";
    const fill = document.createElement("div");
    fill.className = "category-fill";
    fill.style.width = `${(total / largest) * 100}%`;
    track.appendChild(fill);
    const amount = document.createElement("span");
    amount.className = "category-amount";
    amount.textContent = money(total);
    row.append(name, track, amount);
    elements.categoryBreakdown.appendChild(row);
  }
}

function renderApp() {
  renderSummary();
  renderTransactions();
  renderCategories();
}

function addExpense(event) {
  event.preventDefault();
  const description = elements.description.value.trim();
  const amount = Number(elements.amount.value);
  const category = elements.category.value;
  const date = elements.date.value;

  // Validate input before adding a new record.
  if (!description || !date || !Number.isFinite(amount) || amount <= 0) {
    showToast("Please enter a name, a valid amount, and a date.");
    return;
  }
  if (date > new Date().toISOString().slice(0, 10)) {
    showToast("Expense date cannot be in the future.");
    return;
  }

  const expense = {
    id: `expense-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    description,
    amount: Math.round(amount * 100) / 100,
    category,
    date
  };

  expenses.push(expense); // Arrays let the app manage many expense records.
  saveData();
  elements.expenseForm.reset();
  elements.date.value = new Date().toISOString().slice(0, 10);
  renderApp();
  showToast("Expense added successfully.");
}

function deleteExpense(id) {
  const before = expenses.length;
  expenses = expenses.filter(expense => expense.id !== id);
  if (expenses.length === before) return;
  saveData();
  renderApp();
  showToast("Expense deleted.");
}

function updateBudget(event) {
  event.preventDefault();
  const newBudget = Number(elements.budgetInput.value);
  if (!Number.isFinite(newBudget) || newBudget <= 0) {
    showToast("Please enter a budget greater than zero.");
    return;
  }
  monthlyBudget = Math.round(newBudget * 100) / 100;
  saveData();
  elements.budgetForm.reset();
  renderApp();
  showToast("Monthly budget updated.");
}

// Event listeners connect user actions to application logic and DOM updates.
elements.expenseForm.addEventListener("submit", addExpense);
elements.budgetForm.addEventListener("submit", updateBudget);
elements.monthFilter.addEventListener("change", renderTransactions);

const today = new Date();
elements.date.value = today.toISOString().slice(0, 10);
elements.date.max = today.toISOString().slice(0, 10);
elements.todayLabel.textContent = today.toLocaleDateString("en-KE", { weekday: "long", day: "numeric", month: "long", year: "numeric" }).toUpperCase();
renderApp();
