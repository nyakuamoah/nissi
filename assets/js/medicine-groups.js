document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("groupTableBody");
  const form = document.getElementById("addGroupForm");
  const groupNameInput = document.getElementById("groupNameInput");

  let groups = [];

  // Load existing groups
  fetch("./assets/json/groups.json")
    .then((res) => res.json())
    .then((data) => {
      groups = data;
      renderTable(groups);
    })
    .catch((err) => console.error("Error loading groups:", err));

  // Render groups table
  function renderTable(data) {
    tableBody.innerHTML = "";
    data.forEach((group) => {
      tableBody.innerHTML += `
        <tr>
          <td>${group.name}</td>
          <td>${group.medicineCount}</td>
          <td>
            <a href="./group-detail.html?group=${group.name}" class="btn btn-sm btn-outline-primary">View</a>
          </td>
        </tr>
      `;
    });
  }

  // Add new group (simulated)
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.classList.add("was-validated");
      return;
    }

    const newGroup = {
      id: `grp${Date.now()}`, // Simulated ID
      name: groupNameInput.value.trim(),
      medicineCount: 0,
    };

    groups.push(newGroup);
    renderTable(groups);

    alert("New group added successfully (simulated — not saved)");
    groupNameInput.value = "";
    form.classList.remove("was-validated");

    // Close modal
    const modal = bootstrap.Modal.getInstance(
      document.getElementById("addGroupModal")
    );
    modal.hide();
  });
});
