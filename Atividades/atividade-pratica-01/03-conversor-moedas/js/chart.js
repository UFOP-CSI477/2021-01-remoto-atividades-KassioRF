



fetch("https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='EUR'&@dataInicial='10-06-2021'&@dataFinalCotacao='11-06-2021'&$top=100&$format=json")
  .then(response => response.json())
  .then(data => plot(data.value))
  .catch(error => console.log(error));




//--formatar string data  
function getDate(data) {

  data = new Date(data);


  dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  dataFormatada = dataFormatada.substring(0, 5);
  return dataFormatada;
}

function plot(data_all) {
  //format data
  var data = [];
  data_all.forEach(d => {
    if (d.tipoBoletim == 'Fechamento') {
      data.push({
        //'date': d.dataHoraCotacao.split(' ')[0],
        'date': d3.timeParse("%Y-%m-%d")(d.dataHoraCotacao.split(' ')[0]),
        'value': d.cotacaoCompra
      });
    }
  });

  console.log(data);


  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom + 50)
    .append("g")
    .attr("transform",
      "translate(" + margin.left + "," + margin.top + ")")



  //Read Data
  // Add X axis --> it is a date format


  var x = d3.scaleTime()
    .domain(d3.extent(data, function (d) { return d.date; }))
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).tickFormat(function (d) {
      return getDate(d);
    }))
    .selectAll("text")
    .style("text-anchor", "end")
    .attr("dx", "-.8em")
    .attr("dy", ".15em")
    .attr("transform", "rotate(-65)");

  // Add Y axis
  var y = d3.scaleLinear()
    .domain([6.2, 6.8])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));

  // This allows to find the closest X index of the mouse:
  var bisect = d3.bisector(function (d) { return d.date; }).left;
  // Create the circle that travels along the curve of chart
  var focus = svg
    .append('g')
    .append('line')
    .style("stroke", "#2d3436")
    .style("stroke-width", 1)
    .attr("stroke-dasharray", "5,5")
    // .attr("transform", "translate(" + height + "  ,0)")
    .attr("x1", 0)
    .attr("x2", 0)

    .attr("y2", height)
    .style("opacity", 0)


  // var focus = svg
  //   .append('g')
  //   .append('circle')
  //   .style("fill", "none")
  //   .attr("stroke", "black")
  //   .attr('r', 8.5)
  //   .style("opacity", 0)

  // Create the text that travels along the curve of chart
  var focusText = svg
    .append('g')
    .append('text')
    .style("opacity", 0)
    .attr("text-anchor", "left")
    .attr("alignment-baseline", "middle")


  // Add the line
  svg.append("path")
    .datum(data)
    .attr("fill", "none")
    .attr("stroke", "#69b3a2")
    .attr("stroke-width", 2)
    .attr("d", d3.line()
      .x(function (d) { return x(d.date) })
      .y(function (d) { return y(d.value) })
    )

  // svg.append("path")
  //   .datum(data)
  //   .attr("fill", "none")
  //   .attr("stroke", "#69b3a2")
  //   .attr("stroke-width", 2)
  //   .attr("d", d3.line()
  //     .x(function (d) { return x(d.date) })
  //     .y(function (d) { return y(d.value) })
  //   )


  /* ---------------- teste ----------*/




  // Create a rect on top of the svg area: this rectangle recovers mouse position
  svg
    .append('rect')
    .style("fill", "none")
    .style("pointer-events", "all")
    .attr('width', width)
    .attr('height', height)
    .on('mouseover', mouseover)
    .on('mousemove', mousemove)
    .on('mouseout', mouseout);


  // What happens when the mouse move -> show the annotations at the right positions.
  function mouseover() {
    focus.style("opacity", 0.5)
    focusText.style("opacity", 1)
  }

  function mousemove() {
    // recover coordinate we need
    var x0 = x.invert(d3.mouse(this)[0]);
    var i = bisect(data, x0, 1);
    selectedData = data[i]
    focus
      .attr("cx", x(selectedData.date))
      .attr("cy", y(selectedData.value))
      .attr("x1", x(selectedData.date))
      .attr("x2", x(selectedData.date))

    focusText
      .html(getDate(selectedData.date) + "  -  " + selectedData.value)
      .attr("x", x(selectedData.date) + 15)
      .attr("y", y(selectedData.value))


  }
  function mouseout() {
    focus.style("opacity", 0)
    focusText.style("opacity", 0)
  }



};

