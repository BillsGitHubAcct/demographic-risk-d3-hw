var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart, and shift the latter by left and top margins.
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)

var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("Poverty_and_Diabetes.csv", function (err, povDiabData) {
  if (err) throw err;

  // Step 1: Parse Data/Cast as numbers
   // ==============================
  povDiabData.forEach(function (data) {
    data.poverty = +data.poverty;
    data.diabetes = +data.diabetes;
  });

  // Step 2: Create scale functions
  // ==============================
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(povDiabData, d => d.poverty)-1, d3.max(povDiabData, d => d.poverty)+1])
    .range([0, width]);

  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(povDiabData, d => d.diabetes)-1, d3.max(povDiabData, d => d.diabetes)+1])
    .range([height, 0]);

  // Step 3: Create axis functions
  // ==============================
  var bottomAxis = d3.axisBottom(xLinearScale);
  var leftAxis = d3.axisLeft(yLinearScale);

  // Step 4: Append Axes to the chart
  // ==============================
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

   // Step 5: Create Circles
  // ==============================
  var circlesGroup = chartGroup.selectAll("circle")
  .data(povDiabData)
  .enter()
  .append("circle")
  .attr("cx", d => xLinearScale(d.poverty))
  .attr("cy", d => yLinearScale(d.diabetes))
  .attr("r", "18")
  .attr("fill", "magenta")
  .attr("opacity",".35")
  .attr("stroke","black") 
  .attr("stroke-width","4")
  

 var textsGroup = chartGroup.selectAll(null)
  .data(povDiabData)
  .enter()
  .append("text")
  .attr("dx", d => xLinearScale(d.poverty)-4)
  .attr("dy", d => yLinearScale(d.diabetes))
  .style('font-size', 9 + 'px')
  .attr('fill-opacity', 1)
  .attr('fill', 'white')
  .text(d => d.abbreviation)
  console.log(textsGroup)

  // Step 6: Initialize tool tip
  // ==============================
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .html(d =>
      `<div id = 'tiptop'>${d.state}</div><hr><div id = 'tipcts'>Diabetes: ${d.diabetes}% Poverty: ${d.poverty}%</div>`
    );

  // Step 7: Create tooltip in the chart
  // ==============================
  chartGroup.call(toolTip);

  // Step 8: Create event listeners to display and hide the tooltip
  // ==============================
  circlesGroup.on("mouseover", function (data) {
      toolTip.show(data);
    })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .text("Has Diabetes(%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width/2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .text("In Poverty(%)");
});