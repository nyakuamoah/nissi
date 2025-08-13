document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("addMedicineForm");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const medicine = {
      name: document.getElementById("medicineName").value.trim(),
      id: document.getElementById("medicineID").value.trim(),
      group: document.getElementById("groupName").value,
      stockQty: parseInt(document.getElementById("quantity").value),
      usage: document.getElementById("howToUse").value.trim(),
      sideEffects: document.getElementById("sideEffects").value.trim(),
      shortage: false,
    };

    console.log("New Medicine Data:", medicine);
    alert("Medicine added successfully (console only — no backend)");
    form.reset();
    form.classList.remove("was-validated");
  });
});
