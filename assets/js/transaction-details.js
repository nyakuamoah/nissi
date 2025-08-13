// transaction-details.js

let salesData = [];
let usersData = [];
let productsData = [];

const transactionId = new URLSearchParams(window.location.search).get("id");
const transactionForm = document.getElementById("transactionForm");

const transactionIDEl = document.getElementById("transactionID");
const dateEl = document.getElementById("date");
const timeEl = document.getElementById("time");
const customerEl = document.getElementById("customer");
const medicineEl = document.getElementById("medicine");
const quantityEl = document.getElementById("quantity");
const unitPriceEl = document.getElementById("unitPrice");
const totalEl = document.getElementById("total");
const pharmacistEl = document.getElementById("pharmacist");

// Load JSON data
Promise.all([
  fetch("/assets/json/sales.json").then((res) => res.json()),
  fetch("/assets/json/products.json").then((res) => res.json()),
  fetch("/assets/json/users.json").then((res) => res.json()),
])
  .then(([sales, products, users]) => {
    salesData = sales;
    productsData = products;
    usersData = users;

    populateForm();
  })
  .catch((err) => console.error("Failed to load data:", err));

function populateForm() {
  const tx = salesData.find((t) => t.transactionId === transactionId);
  if (!tx) {
    alert("Transaction not found.");
    return;
  }

  // Populate medicine & pharmacist dropdowns
  productsData.forEach((p) => {
    const option = document.createElement("option");
    option.value = p.name;
    option.textContent = p.name;
    medicineEl.appendChild(option);
  });

  usersData.forEach((u) => {
    const option = document.createElement("option");
    option.value = u.name;
    option.textContent = u.name;
    pharmacistEl.appendChild(option);
  });

  // Fill form values
  transactionIDEl.value = tx.transactionId;
  dateEl.value = tx.date;
  timeEl.value = tx.time;
  customerEl.value = tx.customer;
  medicineEl.value = tx.medicine;
  quantityEl.value = tx.quantity;
  unitPriceEl.value = tx.unitPrice;
  totalEl.value = tx.total;
  pharmacistEl.value = tx.pharmacist;
}

// Auto-calculate total when quantity or medicine changes
quantityEl.addEventListener("input", updateTotal);
medicineEl.addEventListener("change", () => {
  const selected = productsData.find((p) => p.name === medicineEl.value);
  unitPriceEl.value = selected ? selected.unitPrice : 0;
  updateTotal();
});

function updateTotal() {
  const qty = parseInt(quantityEl.value);
  const price = parseFloat(unitPriceEl.value);
  totalEl.value = isNaN(qty * price) ? 0 : qty * price;
}

// Update Transaction
transactionForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const index = salesData.findIndex((t) => t.transactionId === transactionId);
  if (index === -1) return alert("Transaction not found.");

  salesData[index] = {
    transactionId: transactionIDEl.value,
    date: dateEl.value,
    time: timeEl.value,
    customer: customerEl.value,
    medicine: medicineEl.value,
    quantity: parseInt(quantityEl.value),
    unitPrice: parseFloat(unitPriceEl.value),
    total: parseFloat(totalEl.value),
    pharmacist: pharmacistEl.value,
  };

  saveToFile();
});

// Delete Transaction
function deleteTransaction() {
  const confirmed = confirm(
    "Are you sure you want to delete this transaction?"
  );
  if (!confirmed) return;

  salesData = salesData.filter((t) => t.transactionId !== transactionId);
  saveToFile();
}

function saveToFile() {
  fetch("/save-sales", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(salesData),
  })
    .then(() => {
      alert("Transaction updated successfully.");
      window.location.href = "/sales.html";
    })
    .catch((err) => alert("Failed to save changes."));
}
