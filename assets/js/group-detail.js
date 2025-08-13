document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const groupName = urlParams.get("group") || "Generic Medicine"; // fallback for demo
  const groupTitle = document.getElementById("groupTitle");
  const tableBody = document.getElementById("groupMedicinesBody");

  groupTitle.textContent = `Group: ${groupName}`;

  fetch("./assets/json/products.json")
    .then((res) => res.json())
    .then((products) => {
      const groupMeds = products.filter((p) => p.group === groupName);

      if (groupMeds.length === 0) {
        tableBody.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No medicines found in this group.</td></tr>`;
        return;
      }

      groupMeds.forEach((med) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${med.name}</td>
          <td>${med.medicineId}</td>
          <td>${med.stockQty}</td>
          <td><button class="btn btn-sm btn-outline-danger remove-btn" data-id="${med.medicineId}">Remove from Group</button></td>
        `;
        tableBody.appendChild(tr);
      });

      // Handle removal (simulation)
      document.querySelectorAll(".remove-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
          const medId = e.target.getAttribute("data-id");
          const row = e.target.closest("tr");
          row.remove();
          alert(`Medicine ${medId} removed from group (simulated)`);
        });
      });
    })
    .catch((err) => {
      console.error("Failed to load group medicines:", err);
      tableBody.innerHTML = `<tr><td colspan="4" class="text-danger text-center">Error loading medicines.</td></tr>`;
    });
});
