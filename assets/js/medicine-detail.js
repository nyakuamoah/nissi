document.addEventListener("DOMContentLoaded", () => {
  const urlParams = new URLSearchParams(window.location.search);
  const medicineId = urlParams.get("medicineId");

  if (!medicineId) {
    alert("Medicine ID not specified.");
    return;
  }

  const form = document.getElementById("medicineDetailForm");

  fetch("/assets/json/products.json")
    .then((res) => res.json())
    .then((products) => {
      const med = products.find((m) => m.medicineId === medicineId);
      if (!med) {
        alert("Medicine not found.");
        return;
      }

      // Prefill form
      document.getElementById("medicineName").value = med.name;
      document.getElementById("medicineID").value = med.medicineId;
      document.getElementById("groupName").value = med.group;
      document.getElementById("quantity").value = med.stockQty;
      document.getElementById("howToUse").value =
        med.usage || "Take this medication as prescribed.";
      document.getElementById("sideEffects").value =
        med.sideEffects || "May cause nausea, dizziness, or headache.";

      // Update handler
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        if (!form.checkValidity()) {
          form.classList.add("was-validated");
          return;
        }

        const updated = {
          name: document.getElementById("medicineName").value,
          id: document.getElementById("medicineID").value,
          group: document.getElementById("groupName").value,
          stockQty: parseInt(document.getElementById("quantity").value),
          usage: document.getElementById("howToUse").value,
          sideEffects: document.getElementById("sideEffects").value,
          shortage: parseInt(document.getElementById("quantity").value) < 30,
        };

        console.log("Updated Medicine:", updated);
        alert("Medicine updated (simulated)");
      });

      // Delete button logic
      const deleteBtn = document.getElementById("confirmDeleteBtn");
      if (deleteBtn) {
        deleteBtn.addEventListener("click", () => {
          console.log(`Medicine ${medicineId} deleted (simulated)`);
          alert("Medicine deleted (simulated)");
          window.location.href = "/inventory.html";
        });
      }
    });
});
