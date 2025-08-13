// sales.js

const salesUrl = "/assets/json/sales.json";
const productsUrl = "/assets/json/products.json";
const usersUrl = "/assets/json/users.json";

let salesData = [];
let products = [];
let users = [];

// Load all data and initialize dashboard
Promise.all([
  fetch(salesUrl).then((res) => res.json()),
  fetch(productsUrl).then((res) => res.json()),
  fetch(usersUrl).then((res) => res.json()),
])
  .then(([sales, prods, userList]) => {
    salesData = sales;
    products = prods;
    users = userList;

    populateDashboard();
    populateTransactionTable(salesData);
    populateTransactionForm();
    populateChart(salesData);
  })
  .catch((err) => console.error("Failed to load sales data:", err));

// Populate dashboard metrics
function populateDashboard() {
  const topMedicines = getTopItems("medicine", 5);
  const topCustomers = getTopItems("customer", 3);
  const topTransactions = [...salesData]
    .sort((a, b) => b.total - a.total)
    .slice(0, 3);

  document.getElementById("topMedicines").innerHTML = topMedicines
    .map((m) => `<li>${m.item} (${m.count})</li>`)
    .join("");

  document.getElementById("topCustomers").innerHTML = topCustomers
    .map((c) => `<li>${c.item} - GHS ${c.total.toFixed(2)}</li>`)
    .join("");

  document.getElementById("topTransactions").innerHTML = topTransactions
    .map(
      (t) => `<li>
    ${t.medicine} - GHS ${t.total} by <strong>${t.pharmacist}</strong>
  </li>`
    )
    .join("");
}

function getTopItems(key, limit) {
  const map = {};
  salesData.forEach((sale) => {
    if (!map[sale[key]]) {
      map[sale[key]] = { count: 0, total: 0 };
    }
    map[sale[key]].count++;
    map[sale[key]].total += parseFloat(sale.total);
  });

  return Object.entries(map)
    .map(([item, value]) => ({ item, ...value }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit);
}

function populateTransactionForm() {
  const medicineSelect = document.getElementById("medicineSelect");
  const pharmacistSelect = document.getElementById("pharmacistSelect");

  products.forEach((p) => {
    const opt = document.createElement("option");
    opt.value = p.name;
    opt.textContent = p.name;
    medicineSelect.appendChild(opt);
  });

  users.forEach((u) => {
    const opt = document.createElement("option");
    opt.value = u.name;
    opt.textContent = u.name;
    pharmacistSelect.appendChild(opt);
  });
}

// Filter by date range
document.getElementById("filterSalesBtn").addEventListener("click", () => {
  const start = document.getElementById("startDate").value;
  const end = document.getElementById("endDate").value;

  if (!start || !end) return;

  const filtered = salesData.filter((tx) => {
    return tx.date >= start && tx.date <= end;
  });

  populateChart(filtered);
});

// For charts and reports
document.addEventListener("DOMContentLoaded", () => {
  let allSales = [];

  const tableBody = document.getElementById("salesTableBody");
  const totalOrders = document.getElementById("totalOrders");
  const totalQty = document.getElementById("totalQty");

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  fetch("/assets/json/sales.json")
    .then((res) => res.json())
    .then((data) => {
      allSales = data;
      updateUI(allSales);
    });

  document.getElementById("filterBtn").addEventListener("click", () => {
    const start = new Date(startDateInput.value);
    const end = new Date(endDateInput.value);
    const filtered = allSales.filter((s) => {
      const d = new Date(s.date);
      return (
        (!isNaN(start) ? d >= start : true) && (!isNaN(end) ? d <= end : true)
      );
    });
    updateUI(filtered);
  });

  function updateUI(data) {
    populateTable(data);
    renderChart(data);
    updateSummary(data);
  }

  function populateTable(data) {
    tableBody.innerHTML = "";
    data.forEach((item) => {
      tableBody.innerHTML += `
        <tr>
          <td>${item.date}</td>
          <td>${item.time}</td>
          <td>${item.medicine}</td>
          <td>${item.quantity}</td>
          <td>
            <a href="/transaction-details.html?id=${item.transactionId}" class="btn btn-sm btn-primary">View</a>
          </td>
        </tr>
      `;
    });
  }

  function updateSummary(data) {
    totalOrders.textContent = data.length;
    totalQty.textContent = data.reduce((sum, s) => sum + s.quantity, 0);
  }

  function renderChart(data) {
    const chartDiv = document.getElementById("chart");
    chartDiv.innerHTML = ""; // Clear previous chart

    const salesByMed = {};
    data.forEach((item) => {
      salesByMed[item.medicine] =
        (salesByMed[item.medicine] || 0) + item.quantity;
    });
    const chartData = Object.entries(salesByMed).map(([name, qty]) => ({
      name,
      qty,
    }));

    const width = chartDiv.clientWidth;
    const height = 300;
    const margin = { top: 20, right: 30, bottom: 40, left: 60 };

    const svg = d3
      .select("#chart")
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    const x = d3
      .scaleBand()
      .domain(chartData.map((d) => d.name))
      .range([margin.left, width - margin.right])
      .padding(0.2);

    const y = d3
      .scaleLinear()
      .domain([0, d3.max(chartData, (d) => d.qty)])
      .nice()
      .range([height - margin.bottom, margin.top]);

    svg
      .append("g")
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(x))
      .selectAll("text")
      .attr("transform", "rotate(-30)")
      .style("text-anchor", "end");

    svg
      .append("g")
      .attr("transform", `translate(${margin.left},0)`)
      .call(d3.axisLeft(y));

    svg
      .selectAll(".bar")
      .data(chartData)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("x", (d) => x(d.name))
      .attr("width", x.bandwidth())
      .attr("y", height - margin.bottom)
      .attr("height", 0)
      .attr("fill", "#50b748")
      .transition()
      .duration(800)
      .attr("y", (d) => y(d.qty))
      .attr("height", (d) => height - margin.bottom - y(d.qty));
  }

  // Export to CSV
  document.querySelector("button.btn-primary").addEventListener("click", () => {
    const headers = ["Order ID", "Date", "Medicine", "Quantity"];
    const rows = [headers.join(",")];
    allSales.forEach((s) => {
      rows.push(`${s.orderId},${s.date},${s.medicine},${s.quantity}`);
    });
    const blob = new Blob([rows.join("\n")], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "pharmacy_sales_report.csv";
    link.click();
  });
});
