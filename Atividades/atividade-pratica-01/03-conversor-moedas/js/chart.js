

//-- Função utilizada para tratar o fetch de duas url's
async function getAllUrls_(urls) {
  try {
    var data = await Promise.all(
      urls.map(
        url =>
          fetch(url).then(
            (response) => response.json()
          )));


    return (data)

  } catch (error) {
    console.log(error)

    throw (error)
  }
}

//Pega as cotações (BRL - X) e (BRL - Y) e transforma na cotação X - Y
const cotacaoFinal = data => {
  let dataDe = data[0].value;
  let dataPara = data[1].value;

  let cotacao = []
  for (let i = 0; i < dataDe.length; i++) {
    if (dataDe[i].tipoBoletim == 'Fechamento' && dataPara[i].tipoBoletim == 'Fechamento') {
      cotacao.push({
        'dataHoraCotacao': dataDe[i].dataHoraCotacao,
        'cotacaoCompra': (dataDe[i].cotacaoCompra / dataPara[i].cotacaoCompra).toFixed(4),
        'tipoBoletim': 'Fechamento'
      });
    }
  }
  return cotacao;
}

//-- Consome API e trada os dados retornado para gerar o gráfico.
const plotCotacao = (dataInfo) => {

  document.getElementById('my_dataviz').innerHTML = '';

  /* Funcao auxiliar para padronizar data para api*/
  function adicionaZero(numero) {
    if (numero <= 9)
      return "0" + numero;
    else
      return numero;
  }

  //Define intervalo de 1 mês das cotações.
  let dateIni = new Date(dataInfo.date);
  dateIni.setMonth(dateIni.getMonth() - 1)
  let dateFinal = new Date(dataInfo.date)

  dateIni = `${adicionaZero(dateIni.getMonth() + 1)}-${adicionaZero(dateIni.getDate())}-${dateIni.getFullYear()}`
  dateFinal = `${adicionaZero(dateFinal.getMonth() + 1)}-${adicionaZero(dateFinal.getDate())}-${dateFinal.getFullYear()}`



  if (dataInfo.moedaDe == 'BRL') {

    let url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${dataInfo.moedaPara}'&@dataInicial='${dateIni}'&@dataFinalCotacao='${dateFinal}'&$top=120&$format=json`;
    fetch(url)
      .then(response => response.json())
      .then(data => plot(data.value))
      .catch(error => console.log(error));

  } else if (dataInfo.moedaPara == 'BRL') {
    let url = `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${dataInfo.moedaDe}'&@dataInicial='${dateIni}'&@dataFinalCotacao='${dateFinal}'&$top=120&$format=json`;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        data.value.forEach(d => {
          d.cotacaoCompra = (1 / d.cotacaoCompra).toFixed(4);

        })
        plot(data.value)


      })
      .catch(error => console.log(error));
  } else {
    let data = getAllUrls_(
      [
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${dataInfo.moedaDe}'&@dataInicial='${dateIni}'&@dataFinalCotacao='${dateFinal}'&$top=120&$format=json`,
        `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaPeriodo(moeda=@moeda,dataInicial=@dataInicial,dataFinalCotacao=@dataFinalCotacao)?@moeda='${dataInfo.moedaPara}'&@dataInicial='${dateIni}'&@dataFinalCotacao='${dateFinal}'&$top=120&$format=json`
      ]
    ).then(data => cotacaoFinal(data))
      .then(cotacao => plot(cotacao));


  }

};


//--formatar string data  
function getDate(data) {

  data = new Date(data);

  dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  dataFormatada = dataFormatada.substring(0, 5);
  return dataFormatada;
}



// -- Recebe os dados no formato adequado para o  gerar gráfico

function plot(data_all) {

  //Obtém as cotações do fechamento do dia para serem exibidas.
  var data = [];
  data_all.forEach(d => {
    if (d.tipoBoletim == 'Fechamento') {
      data.push({
        'date': d3.timeParse("%Y-%m-%d")(d.dataHoraCotacao.split(' ')[0]),
        'value': d.cotacaoCompra
      });
    }
  });

  // set the dimensions and margins of the graph
  var margin = { top: 10, right: 30, bottom: 30, left: 60 },
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom,
    tooltip = { width: 100, height: 100, x: 10, y: -30 };

  // append the svg object to the body of the page
  var svg = d3.select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right + 50)
    .attr("height", (height + margin.top + margin.bottom) + 200)
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
  var min = Math.min(...data.map(item => item.value));
  var max = Math.max(...data.map(item => item.value));
  // Define uma margem de 3% de sobra na imagem do gráfico (eixo y)
  min = min - (min * 0.03);
  max = max + (max * 0.03);
  var y = d3.scaleLinear()
    .domain([min, max])
    .range([height, 0]);
  svg.append("g")
    .call(d3.axisLeft(y));


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
  // Add the points
  svg
    .append("g")
    .selectAll("dot")
    .data(data)
    .enter()
    .append("circle")
    .attr("cx", function (d) { return x(d.date) })
    .attr("cy", function (d) { return y(d.value) })
    .attr("r", 2.5)
    .attr("fill", "#69b3a2")


  /* ---------------- Tooltips ----------*/
  var bisectDate = d3.bisector(function (d) { return d.date; }).left


  var focus = svg.append("g")
    .attr("class", "focus")
    .style("display", "none");

  focus.append("circle")
    .attr("r", 5);

  focus.append("rect")
    .attr("class", "tooltip")
    .attr("width", 110)
    .attr("height", 50)
    .attr("x", -28)
    .attr("y", -70)
    .attr("rx", 4)
    .attr("ry", 4);

  focus.append("text")
    .attr("class", "tooltip-date")
    .attr("x", -18)
    .attr("y", -50);

  focus.append("text")
    .attr("x", -18)
    .attr("y", -35)
    .text("Fech.");

  focus.append("text")
    .attr("class", "tooltip-value")
    .attr("x", 20)
    .attr("y", -35);

  svg.append("rect")
    .attr("class", "overlay")
    .attr("width", width)
    .attr("height", height)
    .on("mouseover", function () { focus.style("display", null); })
    .on("mouseout", function () { focus.style("display", "none"); })
    .on("mousemove", mousemove);

  function mousemove() {
    var x0 = x.invert(d3.mouse(this)[0]),
      i = bisectDate(data, x0, 1),
      d0 = data[i - 1],
      d1 = data[i],
      d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", "translate(" + x(d.date) + "," + y(d.value) + ")");
    focus.select(".tooltip-date").text(getDate(d.date));
    focus.select(".tooltip-value").text(d.value);
  }


};
