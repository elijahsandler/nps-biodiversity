console.log("✅ Script is working!");


// conservation_status_viz.js

// Set up chart area
const width = 800;
const height = 600;

const svg = d3.select("#viz4")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

// Load CSV file
d3.csv("../species.csv").then(data => {
  // Filter to endangered only
  const endangered = data.filter(d => d["Conservation Status"] === "Endangered");

  // Count endangered species per park
  const parkCounts = d3.rollup(endangered, v => v.length, d => d["Park Name"]);

  // Convert to array for D3
  const parks = Array.from(parkCounts, ([name, count]) => ({ name, count }));

  // Set up scale
  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(parks, d => d.count)])
    .range([5, 40]);

  // Create simulation for bubble layout
  const simulation = d3.forceSimulation(parks)
    .force("charge", d3.forceManyBody().strength(1))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => radiusScale(d.count) + 2))
    .on("tick", ticked);

  // Add circles
  const circles = svg.selectAll("circle")
    .data(parks)
    .enter()
    .append("circle")
    .attr("r", d => radiusScale(d.count))
    .attr("fill", "#69b3a2")
    .attr("stroke", "black")
    .attr("stroke-width", 1)
    .append("title")  // Tooltip on hover
    .text(d => `${d.name}: ${d.count} endangered species`);

  function ticked() {
    svg.selectAll("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }
});
