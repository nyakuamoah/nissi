// supplier-details.js
// Simulate fetching supplier details from a query string or default (e.g., ID = 'sup001')
const urlParams = new URLSearchParams(window.location.search);
const supplierId = urlParams.get("id") || "sup001";

fetch("./assets/json/suppliers.json")
  .then((res) => res.json())
  .then((suppliers) => {
    const supplier = suppliers.find((s) => s.id === supplierId);
    if (!supplier) return;

    document.getElementById("supplierName").textContent = supplier.name;
    document.getElementById(
      "supplierRating"
    ).textContent = `${supplier.rating} / 5`;
    document.getElementById("supplierAccreditation").textContent =
      supplier.accreditation;
    document.getElementById("supplierContact").textContent =
      supplier.contactPerson;
    document.getElementById("supplierPhone").textContent = supplier.phone;
    document.getElementById("supplierEmail").textContent = supplier.email;

    const tableBody = document.getElementById("medicineSupplyTable");
    supplier.medicines.forEach((medicine) => {
      const row = document.createElement("tr");
      const dates = medicine.supplyHistory
        .map((s) => `${s.date} (${s.quantity})`)
        .join("<br>");
      row.innerHTML = `
        <td>${medicine.name}</td>
        <td>${medicine.supplyHistory.reduce(
          (sum, s) => sum + s.quantity,
          0
        )}</td>
        <td>${dates}</td>
      `;
      tableBody.appendChild(row);
    });
  })
  .catch((err) => console.error("Error loading supplier data:", err));
