(function () {

  const margin = { top: 40, right: 30, bottom: 20, left: 40 }

  const width = 400 - margin.left - margin.right
  const height = 500 - margin.top - margin.bottom

  // You'll probably need to edit this one
  const svg = d3.select("#chart").append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
      .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")

  // i'll give you between 0-50k
  // you give back between 0-width (left hand side
  // to the right hand side)
  const xPositionScale = d3.scaleLinear()
  .domain([0, 10])
  .range([0, width])

  const yPositionScale = d3.scaleLinear()
  .domain([0, 10])
  .range([height, 0])
  
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
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.seventyfive_and_over))
      .attr('cy', d => yPositionScale(d.Under_5_years))
      .attr('fill', d => colorScale(d.Geography))

    d3.select("#step-1").on('stepin', function() {
      // We only want there to be circles for asia
      let FL = datapoints.filter(d => d.Geography == "Florida")

      svg.selectAll('circle')
        .data(FL, d => d.Geography)
        .join('circle')
        .attr('r', 5)
        .attr('cx', d => xPositionScale(d.seventyfive_and_over))
        .attr('cy', d => yPositionScale(d.Under_5_years))
        .attr('fill', d => colorScale(d.Geography))
      })

    d3.select("#step-2").on('stepin', function() {
      // We only want there to be circles for africa
      let UT = datapoints.filter(d => d.Geography == 'Utah')

      svg.selectAll('circle')
      .data(UT, d => d.Geography)
      .join('circle')
      .attr('r', 5)
      .attr('cx', d => xPositionScale(d.seventyfive_and_over))
      .attr('cy', d => yPositionScale(d.Under_5_years))
      .attr('fill', d => colorScale(d.Geography))
    })
  d3.select("#step-3").on('stepin', function() {
      // We only want there to be circles with a low life expectancy
      let lle = datapoints.filter(d => d.trend = 0)
      svg.selectAll('circle')
        .data(lle, d => d.MMcensusdata1.csv)
        .join(
          enter => enter.append('circle')
                        .attr('cx', d => xPositionScale(d.seventyfive_and_over))
                        .attr('cy', d => yPositionScale(d.Under_5_years))
                        .attr('fill', d => colorScale(d.Geography))
                        .transition()
                        .attr('r', 5),
          exit => exit.transition().attr('r', 0).remove()
        )
    })

    var yAxis = d3.axisLeft(yPositionScale);
    svg.append("g")
      .attr("class", "axis y-axis")
      .call(yAxis)

    var xAxis = d3.axisBottom(xPositionScale)
    svg.append("g")
      .attr("class", "axis x-axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    }

})();