(function () {
  const margin = { top: 40, right: 30, bottom: 20, left: 40 };

  const width = 700 - margin.left - margin.right;
  const height = 500 - margin.top - margin.bottom;

  // You'll probably need to edit this one
  const svg = d3
    .select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  const xPositionScale = d3.scaleLinear().domain([-6, 6]).range([0, width])
  const yPositionScale = d3.scaleLinear().domain([0, 0.5]).range([height, 0])

  // If you are drawing lines or areas or radials
  // all of your d => xPositionScale(d.whatever)
  // and d => yPositionScale(d.whatever)
  // goes into a const line = const area = 
  // this is me describing what the line should
  // look like in terms of x and y - it isn't attr("x")
  // and attr("y") because it's a CONCEPT not an SVG thing
  const line = d3.line()
    .x(d => xPositionScale(d.x))
    .y(d => yPositionScale(d.y))

  const area = d3.area()
    .x(d => xPositionScale(d.x))
    // .y0(height)
    .y0(yPositionScale(0)) // or this, "whatever 0 is for the y axis"
    .y1(d => yPositionScale(d.y))

  d3.tsv("climate-data.tsv").then(ready);

  function ready(datapoints) {
    console.log(datapoints)

    const datapoints1951 = datapoints.filter((d) => d.year == 1951)
    console.log('1951 data is', datapoints1951)

    // make a set of datapoints for each color group
    const veryCold1951 = datapoints.filter((d) => d.year == 1951 && d.x <= -3)
    const cold1951 = datapoints.filter((d) => d.year == 1951 && d.x > -3 && d.x <= -1)
    const normal1951 = datapoints.filter((d) => d.year == 1951 && d.x > -1 && d.x <= 1)
    const warm1951 = datapoints.filter((d) => d.year == 1951 && d.x > 1 && d.x <= 3)
    const hot1951 = datapoints.filter((d) => d.year == 1951 && d.x > 3)

    // if you have a BUNCH of datapoints that you
    // want to attach to ONE thing (typically a path)
    // you're going to use .append("...").datum(datapoints)
    // we're saving this as a variable to update it later
    const yearLabel = svg.append("text")
      .attr("x", xPositionScale(2.5))
      .attr("y", yPositionScale(0.35))
      .attr('text-anchor', 'end') // right-align, the x/y will be at the end of the text
      .attr("font-size", "16px")
      .text("1951-1980")

    // YOUR MISSION
    // update the label on our different steps
    // yearLabel.text("......")
    // 1983-1993
    // 1994-2004
    // 2005-2015

    // make it a LINE by saying fill none and stroke black
    // we gave it an id so we could edit it later with
    // d3.select("#temperature")
    svg.append("path")
      .datum(datapoints1951) // data is plural, but we only have one path!
      .attr('d', area) // no d => or function(d) here bc line wants ALL THE DATA
      .attr('id', 'temperature')
      // .attr('fill', 'none')
      // .attr('stroke', 'black')
      .attr('fill', 'cornflowerblue')
      .attr('opacity', 0.5)

      // Let's draw the baseline!!!!!
      svg.append("path")
        .datum(datapoints1951)
        .attr('d', area) 
        .attr('id', 'baseline')
        .attr('fill', 'linen')
        .lower()

    d3.select('#step-1').on('stepin', function() {
      console.log('stepped into step number one!!!!')
      yearLabel.text("1983-1993")
      // make a list of datapoints from 1983
      // called datapoints1983

      const datapoints1983 = datapoints.filter((d) => d.year == 1983)
      console.log('1983 data is', datapoints1983)

      // Grab the <path> that is the graph off of the path
      // Give it new cool better data
      // and then update the d="...." so it redraws
      svg.select("#temperature")
        .datum(datapoints1983)
        .transition()
        .duration(500) // half a second?
        .attr('d', area)
        .attr('fill', 'darkorchid')
    })

    d3.select('#step-1').on('stepout', function() {
      console.log('stepped back to the top, let us draw 1951')
      yearLabel.text("1951-1980")

      const datapoints1951 = datapoints.filter((d) => d.year == 1951)
      console.log('1951 data is', datapoints1951)

      svg.select("#temperature")
        .datum(datapoints1951)
        .transition()
        .duration(500) // half a second?
        .attr('d', area)
        .attr('fill', 'cornflowerblue')
    })

    

    // YOUR MISSION
    // Make step 2 be 1994 and colored as palevioletred
    // Make step 3 be 2005 and colored as tomato

    d3.select('#step-2').on('stepin', function() {
      const datapoints1994 = datapoints.filter((d) => d.year == 1994)
      console.log('1994 data is', datapoints1994)
      yearLabel.text("1994-2004")

      svg.select("#temperature")
        .datum(datapoints1994)
        .transition()
        .duration(500) // half a second?
        .attr('d', area)
        .attr('fill', 'palevioletred')
    })

    d3.select('#step-3').on('stepin', function() {
      yearLabel.text("2005-2015")
      const datapoints2005 = datapoints.filter((d) => d.year == 2005)
      console.log('2005 data is', datapoints2005)

      svg.select("#temperature")
        .datum(datapoints2005)
        .transition()
        .duration(500) // half a second?
        .attr('d', area)
        .attr('fill', 'tomato')
    })
  }
})();
