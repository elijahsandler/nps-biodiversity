const width = 600;
const height = 500;

const svg = d3.select("#viz6")
  .append("svg")
  .attr("viewBox", `0 0 ${width} ${height}`)
  .attr("preserveAspectRatio", "xMidYMid meet")
  .style("width", "100%")
  .style("height", "auto");


d3.csv("species.csv").then(data => {
  
  const endangered = data.filter(d => d["Conservation Status"] === "Endangered");

  // endangered species per park
  const parkCounts = d3.rollup(endangered, v => v.length, d => d["Park Name"]);

  // array 
  const parks = Array.from(parkCounts, ([name, count]) => ({ name, count }));

  // colors
  const colorScale = d3.scaleSequential(d3.interpolateYlOrRd)
    .domain([0, d3.max(parks, d => d.count)]);
  

  // scale
  const radiusScale = d3.scaleSqrt()
    .domain([0, d3.max(parks, d => d.count)])
    .range([5, 40]);

  svg.append("text")
    .attr("x", width / 2)
    .attr("y", 30)
    .attr("text-anchor", "middle")
    .attr("font-size", "18px")
    .attr("font-weight", "bold")
    .text("Endangered Species by Park");

  // bubble layout
  const simulation = d3.forceSimulation(parks)
    .force("charge", d3.forceManyBody().strength(1))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collision", d3.forceCollide().radius(d => radiusScale(d.count) + 2))
    .on("tick", ticked);

  //  circles
  const circles = svg.selectAll("circle")
    .data(parks)
    .enter()
    .append("circle")
    .attr("r", d => radiusScale(d.count))
    .attr("fill", d => colorScale(d.count))
    .attr("stroke", "black")
    .attr("stroke-width", 1);

  circles.append("title")
    .text(d => `${d.name}: ${d.count} endangered species`);

  function ticked() {
    svg.selectAll("circle")
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }
});
