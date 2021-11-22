(function () {

  const margin = { top: 40, right: 30, bottom: 50, left: 50 }

  const width = 500 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  // You'll probably need to edit this one
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
  
  svg.append("text")
      .attr("x", width / 2 )
      .attr("y", 0)
      .style("text-anchor", "middle")
      .text("Proportion of very young and very old residents by state");
 

// Add X axis label
svg.append("text")
    .attr("text-anchor", "end")
    .attr("x", -120 )
    .attr("y", -40)
    .attr("transform", "rotate(-90)")
    .text("Population Under 5 Years");
// Add Y axis label
  svg.append("text")
  .attr("text-anchor", "end")
  .attr("x", 300 )
  .attr("y", 450)
  //.attr("transform", "rotate(90)")
  .text("Population 75 Years and Over");
// i'll give you between 0-50k
// you give back between 0-width (left hand side
// to the right hand side)


  const xPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([0, width]);

  const yPositionScale = d3.scaleLinear()
    .domain([0, 10])
    .range([ height, 0])

  const colorScale = d3.scaleOrdinal()
    .range(['#b3e2cd','#fdcdac','#cbd5e8','#f4cae4','#e6f5c9','#fff2ae','#f1e2cc','#cccccc'])

  // hey d3! read in countries.csv
  // and when you're done, go run 'ready'
  d3.csv("MMcensusdata1.csv")
    .then(ready)

  function ready (datapoints) {
    // add one circle to the 
    // svg for each datapoint

    // grab all circles inside of the svg
    // attach the datapoints to the circles
    // make sure we have the right num of circles
  svg.selectAll('circle')
    .data(datapoints, d => d.Geography)
    .enter().append("circle")
    .attr("r", 5)
    .transition()
    .duration(2500)
    .attr('cx', d => xPositionScale(d.seventyfive_and_over))
    .attr('cy', d => yPositionScale(d.Under_5_years))
    .attr('fill', d => colorScale(d.Geography))
 
    d3.select("#step-1").on('stepin', function() {
      // If you aren't Asia, you're grey
      d3.selectAll('circle')
        .filter(d => d.Geography !== 'Florida')
        .transition()
        .attr('fill', 'lightgrey')
    
      // if you're Asia, you get a stroke
      d3.selectAll('circle')
        .filter(d => d.Geography === 'Florida')
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'black')
        .raise()
      
    })

    d3.select("#step-1").on('stepout', function() {
      // Reset fill and stroke when scrolling back to top
      d3.selectAll('circle')
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'none')
    })


    d3.select("#step-2").on('stepin', function() {
      // Reset fill and stroke when scrolling to step 2
      d3.selectAll('circle')
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'none')
        .raise()
    })

    d3.select("#step-2").on('stepin', function() {
      
      d3.selectAll('circle')
      .filter(d => d.trend !== 4)
      .transition()
      .attr('fill', 'lightgrey')
      .attr('stroke', 'none')
      d3.selectAll('circle')
      .filter(d => d.trend > 4)
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'black')

    })

    d3.select("#step-2").on('stepout', function() {
      // Reset fill and stroke when scrolling back to top
      d3.selectAll('circle')
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'none')
    })

    d3.select("#step-3").on('stepin', function() {
      // Reset fill and stroke when scrolling to step 2
      d3.selectAll('circle')
        .filter(d => d.trend !== 0)
        .transition()
        .attr('fill','lightgrey')
        .attr('stroke', 'none')

        d3.selectAll('circle')
        .filter(d => d.trend > 0)
        .transition()
        .attr('fill', d => colorScale(d.Geography))
        .attr('stroke', 'black')
        .raise()

      })

      d3.select("#step-3").on('stepout', function() {
        // Reset fill and stroke when scrolling back to top
        d3.selectAll('circle')
          .transition()
          .attr('fill', d => colorScale(d.Geography))
          .attr('stroke', 'none')
      })
 // Create tooltip
 const tooltip = d3
  .select("body")
  .append("div")
  .attr("class", "svg-tooltip")
  .style("position", "absolute")
  .style("visibility", "hidden");
  

 // Trigger tooltip
 //if d YP is bigger than d OP set variable If (d.old > d.young) { tooltipText = “There are more old people” } else { tooltipText = “There are more young people” }
d3.selectAll("circle")
.on("mouseover", function(e, d) {
 d3.select(this)
   .attr('stroke-width', '2')
   .attr("stroke", "black");
   d3.select(e.target).raise();
 tooltip
   .style("visibility", "visible")
   .text(`State: ${d.Geography}\nSmall children percent:${d.Under_5_years}%\nElderly adult percent:${d.seventyfive_and_over}%`);
})
.on("mousemove", function(e) {
 tooltip
   .style("top", e.pageY - 10 + "px")
   .style("left", e.pageX + 10 + "px");
})
.on("mouseout", function() {
 d3.select(this).attr('stroke-width', '0');
   tooltip.style("visibility", "hidden");
});
  

    var yAxis = d3.axisLeft(yPositionScale).tickFormat( d => d + "%");
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis);


    var xAxis = d3.axisBottom(xPositionScale).tickFormat( d => d + "%");
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
      

    }

})();