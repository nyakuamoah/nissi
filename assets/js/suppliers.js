// Suppliers.js
const supplierSearch = document.getElementById("supplierSearch");
const supplierTableBody = document.getElementById("supplierTableBody");

let suppliersData = [];

// Load supplier data from JSON file
fetch("./assets/json/suppliers.json")
  .then((res) => res.json())
  .then((data) => {
    suppliersData = data.map((supplier, index) => ({
      id: supplier.id || `sup${String(index + 1).padStart(3, "0")}`,
      ...supplier,
    }));
    renderSuppliers(suppliersData);
  })
  .catch((err) => console.error("Error loading suppliers:", err));

// Render supplier table
function renderSuppliers(suppliers) {
  supplierTableBody.innerHTML = "";
  suppliers.forEach((supplier) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${supplier.name}</td>
      <td>${"★".repeat(supplier.rating)}${"☆".repeat(5 - supplier.rating)}</td>
      <td>${supplier.medicines.map((m) => m.name).join(", ")}</td>
      <td><a href="./supplier-details.html?id=${
        supplier.id
      }" class="btn btn-sm btn-primary">View</a></td>
    `;
    supplierTableBody.appendChild(row);
  });
}

// Filter suppliers by name or medicine
supplierSearch.addEventListener("input", () => {
  const query = supplierSearch.value.toLowerCase();
  const filtered = suppliersData.filter((s) => {
    return (
      s.name.toLowerCase().includes(query) ||
      s.medicines.some((m) => m.name.toLowerCase().includes(query))
    );
  });
  renderSuppliers(filtered);
});
