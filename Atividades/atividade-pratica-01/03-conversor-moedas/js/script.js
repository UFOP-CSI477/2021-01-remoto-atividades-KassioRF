

const apiURLMoedas = 'https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/Moedas?$top=100&$format=json';

/** ------- Carrega dados API ------- */

// -- Carregar moedas e preencher Select

var moedas = []

const carregarMoedas = data => {
  let optionBRL = document.createElement('option');
  optionBRL.value = 'BRL';
  optionBRL.innerHTML = 'Real (BRL)';


  let converterDe = document.getElementById('converter-de');
  let converterPara = document.getElementById('converter-para');

  converterDe.innerHTML = '';
  converterPara.innerHTML = '';

  converterDe.appendChild(optionBRL.cloneNode(true));
  optionBRL.setAttribute('disabled', 'disabled');
  converterPara.appendChild(optionBRL.cloneNode(true));


  data.reverse();

  data.forEach(d => {
    let option = document.createElement('option');

    option.value = d.simbolo;
    option.innerHTML = `${d.nomeFormatado} (${d.simbolo})`;

    if (d.simbolo == 'USD') {

      option.setAttribute('disabled', 'disabled')
      converterDe.appendChild(option.cloneNode(true));

      option.removeAttribute('disabled')
      option.setAttribute('selected', 'true');
      converterPara.appendChild(option.cloneNode(true));
    } else {
      converterPara.appendChild(option.cloneNode(true));
      converterDe.appendChild(option.cloneNode(true));
    }
    //converterPara.appendChild(option.cloneNode(true));

    moedas.push(d);

  });

};
const getMoedas = () => {
  fetch(apiURLMoedas)
    .then(response => response.json())
    .then(data => carregarMoedas(data.value))
    .catch(error => console.log(error));
};

getMoedas();


/** ------- Eventos ------- */

//-- Desabilitar select com moedas repetidas
const disableSelectedOption = element => {
  let selectToBlockId = element.id == 'converter-de' ? 'converter-para' : 'converter-de';
  let selectToBlock = document.getElementById(selectToBlockId);

  let optionIndex = element.selectedIndex;

  for (let i = 0; i <= moedas.length; i++) {
    if (optionIndex == i) {
      selectToBlock.options[i].setAttribute('disabled', 'disabled');
    } else {
      selectToBlock.options[i].removeAttribute('disabled');
    }
  }



};

//-- Inverter opção de conversão

const invertOption = () => {
  let convDe = document.getElementById('converter-de');
  let convPara = document.getElementById('converter-para');

  let indexDe = convDe.selectedIndex;
  let indexPara = convPara.selectedIndex;

  convDe.selectedIndex = indexPara;
  convPara.selectedIndex = indexDe;

  disableSelectedOption(convDe);
  disableSelectedOption(convPara);

  getConvert();

};

/** ------- Conversão ------- */

// teste
async function getAllUrls(urls) {
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
//-- Atualizar resultado
const updateResult = (data) => {
  console.log(data);

  //resultado da conversao

  let deMoeda = document.getElementById('res-moeda-de');
  let deValor = document.getElementById('res-valor-de');
  let paraMoeda = document.getElementById('res-moeda-para');
  let paraValor = document.getElementById('res-valor-para');

  deMoeda.innerHTML = data.moedaDe;
  deValor.innerHTML = parseFloat(data.valor).toFixed(4);
  paraMoeda.innerHTML = data.moedaPara;
  paraValor.innerHTML = data.resultado.toFixed(4);


  //data da cotacao
  document.getElementById('data-cotacao').innerHTML = ' - ' + data.date.split('.')[0];
  //resumo da cotacao
  let cotacao = document.getElementById('cotacao-info');
  let entrada = document.createElement('p');
  let saida = document.createElement('p');
  entrada.innerHTML = ` - 1.00 ${data.moedaDe} = ${(data.resultado / data.valor).toFixed(4)} ${data.moedaPara}`;
  saida.innerHTML = ` - 1.00 ${data.moedaPara} = ${(data.valor / data.resultado).toFixed(4)} ${data.moedaDe}`;

  cotacao.innerHTML = '';
  cotacao.appendChild(entrada);
  cotacao.appendChild(saida);

};



//-- Converter
const convert = data => {
  if (!data.cotacaoDe) {
    //data.cotacaoDe['cotacaoCompra'] = 1;
    data.resultado = 1 / data.cotacaoPara.cotacaoCompra;
    data.date = data.cotacaoPara.dataHoraCotacao;

  } else if (!data.cotacaoPara) {
    //data.cotacaoPara['cotacaoCompra'] = 1;
    data.resultado = data.cotacaoDe.cotacaoCompra;
    data.date = data.cotacaoDe.dataHoraCotacao;

  } else {
    cotDe = data.cotacaoDe.cotacaoCompra;
    cotPara = data.cotacaoPara.cotacaoCompra;
    data.resultado = cotDe / cotPara;

    data.date = data.cotacaoDe.dataHoraCotacao;

  }

  data.resultado *= data.valor;

  return data;

  //updateResult(data, resultado);


}

const getConvert = () => {
  let convDe = document.getElementById('converter-de');
  let convPara = document.getElementById('converter-para');


  let indexDe = convDe.selectedIndex;
  let indexPara = convPara.selectedIndex;

  let valor = document.getElementById('converter-valor').value;
  let de = convDe.options[indexDe].value;
  let para = convDe.options[indexPara].value;


  //@ ADD DATA
  data = getAllUrls([
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${de}'&@dataCotacao='11-05-2021'&$top=100&$format=json`,
    `https://olinda.bcb.gov.br/olinda/servico/PTAX/versao/v1/odata/CotacaoMoedaDia(moeda=@moeda,dataCotacao=@dataCotacao)?@moeda='${para}'&@dataCotacao='11-05-2021'&$top=100&$format=json`
  ]).then(d =>
    convert(
      {
        'moedaDe': de,
        'moedaPara': para,
        'cotacaoDe': d[0].value[d[0].value.length - 1],
        'cotacaoPara': d[1].value[d[1].value.length - 1],
        'valor': valor,
        'date': '',
        'resultado': 0
      }


    ))
    .then(resultado => updateResult(resultado));

};
