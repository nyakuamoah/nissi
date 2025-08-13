document.addEventListener("DOMContentLoaded", () => {
  const medCount = document.getElementById("medicinesCount");
  const shortageCount = document.getElementById("shortageCount");
  const groupCount = document.getElementById("groupCount");

  // Load medicines
  fetch("./assets/json/products.json")
    .then((res) => res.json())
    .then((data) => {
      medCount.textContent = data.length;
      const lowStock = data.filter((m) => m.stockQty < 30).length;
      shortageCount.textContent = lowStock;
    });

  // Load groups
  fetch("./assets/json/groups.json")
    .then((res) => res.json())
    .then((groups) => {
      groupCount.textContent = groups.length;
    });
});
