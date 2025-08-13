document.addEventListener("DOMContentLoaded", () => {
  const list = document.getElementById("notificationList");
  const STORAGE_KEY = "pharma_notifications";

  // Simulate persistence using localStorage
  function loadNotifications() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }

    // Fallback: load from JSON file
    return fetch("./assets/json/notifications.json")
      .then((res) => res.json())
      .then((data) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      });
  }

  function renderNotifications(notifs) {
    list.innerHTML = "";
    notifs.forEach((n) => {
      const date = new Date(n.date).toLocaleString();
      const item = document.createElement("li");
      item.className = `list-group-item d-flex justify-content-between align-items-start ${
        n.read ? "" : "bg-light"
      }`;
      item.innerHTML = `
        <div class="ms-2 me-auto">
          <div class="fw-bold">
            <i class="fas fa-${
              n.type === "stock" ? "exclamation-triangle" : "info-circle"
            } me-2 text-${n.type === "stock" ? "danger" : "primary"}"></i>
            ${n.message}
          </div>
          <small class="text-muted">${date}</small>
        </div>
        ${
          !n.read
            ? `<button class="btn btn-sm btn-outline-success mark-read-btn" data-id="${n.id}">Mark as Read</button>`
            : ""
        }
      `;
      list.appendChild(item);
    });

    function updateSidebarBadge(notifs) {
      const unreadCount = notifs.filter((n) => !n.read).length;
      const badge = document.getElementById("notifCount");

      if (badge) {
        if (unreadCount > 0) {
          badge.textContent = unreadCount;
          badge.style.display = "inline-block";
        } else {
          badge.style.display = "none";
        }
      }
    }

    renderNotifications(updated);
    updateSidebarBadge(updated);

    // Attach button actions
    document.querySelectorAll(".mark-read-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-id");
        const updated = notifs.map((n) =>
          n.id === id ? { ...n, read: true } : n
        );
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        renderNotifications(updated);
      });
    });
  }

  // Load and render
  Promise.resolve(loadNotifications()).then(renderNotifications);
});
