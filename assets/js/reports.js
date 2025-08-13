document.addEventListener("DOMContentLoaded", () => {
  let allSales = [];

  const tableBody = document.getElementById("salesTableBody");
  const totalOrders = document.getElementById("totalOrders");
  const totalQty = document.getElementById("totalQty");

  const startDateInput = document.getElementById("startDate");
  const endDateInput = document.getElementById("endDate");

  fetch("./assets/json/sales.json")
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
          <td>${item.transactionId}</td>
          <td>${item.date}</td>
          <td>${item.medicine}</td>
          <td>${item.quantity}</td>
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
      .attr("fill", "#0d6efd")
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
