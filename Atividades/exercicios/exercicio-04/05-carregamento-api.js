
const limparSelect = campo => {
  while (campo.length > 1) {
    campo.remove(1);
  }
}


const preencherSelectRegioes = data => {

  let select = document.getElementById('regiao');
  limparSelect(select);

  data.forEach(d => {
    let { id, nome } = d;

    let option = document.createElement('option');
    option.value = id;
    option.innerHTML = nome;

    select.appendChild(option);
  })

}


const preencherSelectEstados = data => {
  console.log(data)
  let select = document.getElementById('estado');
  limparSelect(select);

  data.forEach(d => {
    let { id, nome, sigla } = d;

    let option = document.createElement('option');
    option.value = id;
    option.innerHTML = `${sigla} - ${nome}`;

    select.appendChild(option);
  })

}

const preencherSelectCidades = data => {

  let select = document.getElementById('cidade');
  limparSelect(select);

  data.forEach(d => {
    let { id, nome } = d;

    let option = document.createElement('option');
    option.value = id;
    option.innerHTML = nome;

    select.appendChild(option);
  })

}


const carregarRegiao = f => {
  fetch('https://servicodados.ibge.gov.br/api/v1/localidades/regioes/1%7C2%7C3%7C4%7C5')
    .then(response => response.json())
    .then(data => preencherSelectRegioes(data))
    .catch(error => console.log(error));
};


const carregarEstados = f => {
  let regiao = document.getElementById('regiao');
  let regiao_index = regiao.selectedIndex;
  let regiao_id = regiao.options[regiao_index].value;

  let estados = document.getElementById('estado');
  limparSelect(estados);
  limparSelect(document.getElementById('cidade'))
  if (regiao_id == '') {

    return;
  }

  const url_estados = `https://servicodados.ibge.gov.br/api/v1/localidades/regioes/${regiao_id}/estados`;
  console.log(url_estados);

  fetch(url_estados)
    .then(response => response.json())
    .then(data => preencherSelectEstados(data))
    .catch(error => console.log(error));
};

const carregarCidades = f => {
  let estados = document.getElementById('estado');
  let estado_index = estados.selectedIndex;
  let estado_id = estados.options[estado_index].value;

  let cidades = document.getElementById('cidade');
  limparSelect(cidades);

  if (estado_id == "") {
    return;
  };

  const url_cidades = `https://servicodados.ibge.gov.br/api/v1/localidades/estados/${estado_id}/municipios`;

  fetch(url_cidades)
    .then(response => response.json())
    .then(data => preencherSelectCidades(data))
    .catch(error => console.log(error));

};