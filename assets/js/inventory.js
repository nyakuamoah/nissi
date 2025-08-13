document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("inventoryTableBody");
  const searchInput = document.getElementById("searchInput");

  // Load product data
  fetch("./assets/json/products.json")
    .then((res) => res.json())
    .then((data) => {
      let allProducts = data;

      const renderTable = (products) => {
        tableBody.innerHTML = "";
        products.forEach((item) => {
          tableBody.innerHTML += `
            <tr>
              <td>${item.name}</td>
              <td>${item.medicineId}</td>
              <td>${item.group}</td>
              <td>${item.stockQty}</td>
              <td>
                ${
                  item.shortage
                    ? '<span class="badge bg-danger">Yes</span>'
                    : '<span class="badge bg-success">No</span>'
                }
              </td>
              <td>
                <a href="./medicine-detail.html?medicineId=${
                  item.medicineId
                }" class="btn btn-sm btn-outline-primary">View</a>
              </td>

            </tr>
          `;
        });
      };

      renderTable(allProducts);

      // Search functionality
      searchInput.addEventListener("input", (e) => {
        const val = e.target.value.toLowerCase();
        const filtered = allProducts.filter(
          (p) =>
            p.name.toLowerCase().includes(val) ||
            p.id.toLowerCase().includes(val)
        );
        renderTable(filtered);
      });
    })
    .catch((err) => console.error("Failed to load inventory data:", err));
});
