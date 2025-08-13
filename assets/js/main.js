document.addEventListener("DOMContentLoaded", function () {
  const now = new Date();
  const hour = now.getHours();
  const dateTimeText = now.toLocaleString();
  const greetingText = document.getElementById("greetingText");
  const dateTimeDisplay = document.getElementById("dateTime");

  if (hour < 12) {
    greetingText.textContent = "Good Morning";
  } else if (hour < 17) {
    greetingText.textContent = "Good Afternoon";
  } else {
    greetingText.textContent = "Good Evening";
  }

  dateTimeDisplay.textContent = dateTimeText;

  // Load product data and update stats
  fetch("/assets/json/products.json")
    .then((res) => res.json())
    .then((products) => {
      const total = products.length;
      const shortage = products.filter((p) => p.stockQty < 30);

      document.getElementById("totalMedicines").textContent = total;
      document.getElementById("shortageCount").textContent = shortage.length;
      document.getElementById("lowStockCount").textContent = shortage.length;

      if (shortage.length > 0) {
        document.getElementById("stockAlert").classList.remove("d-none");
        const badge = document.getElementById("sidebarAlertCount");
        if (badge) {
          badge.textContent = shortage.length;
          badge.style.display = "inline-block";
        }
      }
    });

  // Load user info (Dorinda)
  fetch("/assets/json/users.json")
    .then((res) => res.json())
    .then((users) => {
      const dorinda = users.find((u) => u.name.toLowerCase() === "dorinda");
      if (!dorinda) return;

      const sidebarUser = document.getElementById("sidebarUser");
      sidebarUser.innerHTML = `
        <img src="${dorinda.image}" alt="${dorinda.name}" class="rounded-circle" width="40" height="40" />
        <div class="text-white">
          <div class="fw-semibold">${dorinda.name}</div>
          <small class="text-light">${dorinda.role}</small>
        </div>
      `;
    })
    .catch((err) => console.error("User load failed:", err));
});
