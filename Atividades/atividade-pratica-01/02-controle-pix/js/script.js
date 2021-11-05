
/** --- Define data inicial --- */
var chaves = {
  'cpf': '123.457.789-10',
  'telefone': '(31)91234-5678',
  'email': 'user@email.com',
  'aleatoria': 'N9TT9G0AB7FQRANC'
};

var extrato = [
  {
    'tipo': 'recebido',
    'data': new Date('2021-11-01'),
    'chave': {
      'tipo': 'telefone',
      'chave': '(31)95555-5111',
    },
    'banco': '00000208',
    'valor': '359.95'
  },
  {
    'tipo': 'recebido',
    'data': new Date('2021-10-03'),
    'chave': {
      'tipo': 'cpf',
      'chave': '999.999.999-10',
    },
    'banco': '00000208',
    'valor': '1200.00'
  },
  {
    'tipo': 'recebido',
    'data': new Date('2021-09-25'),
    'chave': {
      'tipo': 'aleatoria',
      'chave': 'AHIQWEIQWEHIQWEIHA',
    },
    'banco': '00000208',
    'valor': '330.27'
  },
  {
    'tipo': 'enviado',
    'data': new Date('2021-11-03'),
    'chave': {
      'tipo': 'telefone',
      'chave': '(31)91234-1234',
    },
    'banco': '00000000',
    'valor': '50.00'
  },
  {
    'tipo': 'enviado',
    'data': new Date('2021-08-15'),
    'chave': {
      'tipo': 'email',
      'chave': 'joao@email.com',
    },
    'banco': '00000208',
    'valor': '200.00'
  },
  {
    'tipo': 'enviado',
    'data': new Date('2021-10-19'),
    'chave': {
      'tipo': 'cnpj',
      'chave': '12.312.312/0001-45',
    },
    'banco': '00000208',
    'valor': '310.00'
  },

  {
    'tipo': 'enviado',
    'data': new Date('2021-10-19'),
    'chave': {
      'tipo': 'aleatoria',
      'chave': 'AHIQWEIQWEHIQWEIHA',
    },
    'banco': '00000000',
    'valor': '25.30'
  },
]



/** --- Classe Conta ---  */
function Conta(chaves, extrato, banco) {
  this.chaves = chaves;
  this.extrato = extrato;
  this.banco = banco


  this.getExtratoGeral = () => {
    let extrato_total = this.extrato;

    extrato_total.sort(function (a, b) {
      var c = new Date(a.data);
      var d = new Date(b.data);
      return d - c;
    });


    return extrato_total;
  }
  this.getExtratoRecebidos = () => {
    let sorted = []
    this.extrato.forEach(e => {
      if (e.tipo == 'recebido') {
        sorted.push(e);
      }
    });

    sorted.sort(function (a, b) {
      var c = new Date(a.data);
      var d = new Date(b.data);
      return d - c;
    });

    return sorted;
  }
  this.getExtratoEnviados = () => {

    let sorted = []
    this.extrato.forEach(e => {
      if (e.tipo == 'enviado') {
        sorted.push(e);
      }
    });

    sorted.sort(function (a, b) {
      var c = new Date(a.data);
      var d = new Date(b.data);
      return d - c;
    });

    return sorted;
  }

  this.getSaldo = () => {
    let saldo = 0;
    this.extrato.forEach(e => {
      if (e.tipo == 'recebido') {
        saldo += parseFloat(e.valor);
      } else if (e.tipo == 'enviado') {
        saldo -= parseFloat(e.valor);
      }

    });

    return saldo.toFixed(2);
  }

};



var conta = new Conta(chaves, extrato, 1);


/**--- Api Bancos */
//-- Preencher select Bancos
const loadBanksOptions = data => {
  let select = document.getElementById('select-banco');
  data.forEach(d => {

    let option = document.createElement('option');
    if (d.code) {
      option.value = d.code;
      option.innerHTML = `${d.code} - ${d.name}`;
      select.appendChild(option);

    }

  });
};

const getBankByCode = code => {

  return fetch(`https://brasilapi.com.br/api/banks/v1/${code}`)
    .then(response => response.json())
    .then(function (data) {
      console.log(data);
      return data;
    })
    .catch(error => console.log(error));



}

//-- Consome API bancos
const getBanksData = () => {
  fetch('https://brasilapi.com.br/api/banks/v1')
    .then(response => response.json())
    .then(data => loadBanksOptions(data))
    .catch(error => console.log(error));
};

/** --- Métodos auxiliares --- */
//--formatar string data  
const getDate = data => {
  data = new Date(data);
  dataFormatada = data.toLocaleDateString('pt-BR', { timeZone: 'UTC' });
  return dataFormatada;
}

//--gerar código re recebimento
function generateRecieveCode(length = 18) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() *
      charactersLength));
  }
  return result;
}

//-- Cria input de acordo com a chave selecionada
const defineKeyInput = element => {
  let typeIndex = element.selectedIndex;
  let type = element.options[typeIndex].value;

  if (type) {
    let add_input = document.getElementById('input-chave-div');
    let label = document.createElement('label');
    label.setAttribute('for', `transferir-${type}`);
    label.innerHTML = type.toUpperCase();

    let input = document.createElement('input');
    input.className = "form-control";
    input.id = `transferir-${type}`;

    input.setAttribute('required', 'true');


    if (type == 'cpf') {
      input.type = 'text';
      input.setAttribute('onkeypress', "$(this).mask('000.000.000-00')");
    } else if (type == 'cnpj') {
      input.type = 'text';
      input.setAttribute('onkeypress', "$(this).mask('00.000.000/0000-00')");
    } else if (type == 'telefone') {
      input.type = 'text';
      input.setAttribute('onkeypress', "$(this).mask('(00) 0000-00009')");
    } else if (type == 'email') {
      input.type = 'email';
    } else if (type == 'aleatoria') {
      input = document.createElement('textarea');
      input.className = 'form-control';
      input.id = `transferir-${type}`;
      input.setAttribute('rows', "2");
      input.setAttribute('required', "true");
    } else {
      add_input.innerHTML = '';
      document.getElementById('transferir-continue').className = 'hidden';
      return;
    }


    add_input.innerHTML = '';
    add_input.appendChild(label);
    add_input.appendChild(input);

    document.getElementById('transferir-continue').classList.remove('hidden');
    getBanksData();

  }

}


/** --- Métodos de atualização da página  ---  */
const getTransactionHistory = (tbody, filter) => {



  tbody.innerHTML = '';
  let extrato;

  if (filter == 'recebidos') {
    extrato = conta.getExtratoRecebidos();
  } else if (filter == 'enviados') {
    extrato = conta.getExtratoEnviados();
  } else {
    extrato = conta.getExtratoGeral();
  }

  extrato.forEach(e => {

    let tr = document.createElement('tr');
    let td_data = document.createElement('td');
    let td_chave = document.createElement('td');
    let td_chaveTipo = document.createElement('td');
    let td_valor = document.createElement('td');
    let span_valor = document.createElement('td');

    td_data.innerHTML = getDate(e.data);
    td_chaveTipo.innerHTML = e.chave.tipo;
    td_chave.innerHTML = e.chave.chave;

    if (e.tipo == 'recebido') {
      span_valor.className = 'saldo-entrada';
      span_valor.innerHTML = `${e.valor} +`;
    } else {
      span_valor.className = 'saldo-saida';
      span_valor.innerHTML = `${e.valor} -`;
    }

    td_valor.appendChild(span_valor);
    tr.appendChild(td_data);
    tr.appendChild(td_chaveTipo);
    tr.appendChild(td_chave);
    tr.appendChild(td_valor);

    tbody.appendChild(tr);
  });




  let saldoElement = document.getElementById('saldo');
  let saldo = conta.getSaldo();

  saldoElement.className = saldo < 0 ? 'saldo-saida' : 'saldo-entrada';

  saldoElement.innerHTML = `R$ ${saldo}`;




}


//-- Carrega chaves do usuario
const loadUserKeys = () => {
  let tbody = document.getElementById('chaves-usuario');
  tbody.innerHTML = '';


  for (let [key, value] of Object.entries(conta.chaves)) {
    let tr = document.createElement('tr');
    let th = document.createElement('th');
    let td = document.createElement('td');
    th.innerHTML = key.toUpperCase();
    td.innerHTML = value;
    tr.appendChild(th);
    tr.appendChild(td);
    tbody.appendChild(tr);
  }

};

const loadTransactions = (filter) => {
  let tbody = document.getElementById('tabela-extrato');
  getTransactionHistory(tbody, filter);

};


/** --- Métodos do controle de transações  ---  */

//-- Metodo para preencher o elemento com resumo da transação efetuada
const appendTransactionResume = transacao => {
  let modal = document.getElementById('transferencia-resumo');

  modal.innerHTML = '<div class="d-flex justify-content-center">';
  modal.innerHTML += '<div class="spinner-border text-success" role="status">';
  modal.innerHTML += ' <span class="visually-hidden">Loading...</span>';
  modal.innerHTML += '</div></div>';

  getBankByCode(transacao.banco).then(banco_data => {


    let chave = document.createElement('p');
    let banco = document.createElement('p');
    let data = document.createElement('p');
    let valor = document.createElement('p');
    chave.innerHTML = `Destinatário: ${transacao.chave.chave}`;
    banco.innerHTML = `Banco: ${banco_data.code} - ${banco_data.fullName}`;
    data.innerHTML = `Data: ${getDate(transacao.data)}`;
    valor.innerHTML = `Valor: ${transacao.valor}`;

    modal.innerHTML = '';

    modal.appendChild(chave);
    modal.appendChild(banco);
    modal.appendChild(data);
    modal.appendChild(valor);


  });
}

const getDataTransaction = () => {
  let selectChave = document.getElementById('select-chave');
  let tipoChaveIndex = selectChave.selectedIndex;
  let tipoChave = selectChave.options[tipoChaveIndex].value;

  let chave = document.getElementById(`transferir-${tipoChave}`).value;
  let selectBanco = document.getElementById('select-banco');
  let bancoIndex = selectBanco.selectedIndex;
  let banco = selectBanco.options[bancoIndex].value;

  let valor = document.getElementById('transferir-valor').value;

  let transacao = {
    'tipo': 'enviado',
    'data': new Date(),
    'chave': {
      'tipo': tipoChave,
      'chave': chave,
    },
    'banco': banco,
    'valor': parseFloat(valor).toFixed(2)
  };

  return transacao;

}

const makeTransaction = () => {
  let transacao = getDataTransaction();
  conta.extrato.push(transacao);
  loadTransactions('');

  //limpar inputs
  let chave_input = document.getElementById('input-chave-div');
  chave_input.innerHTML = ''
  document.getElementById('transferir-form').reset();
  document.getElementById('transferir-continue').className = 'hidden';
  //goTotransactions -- Preencher modal
  appendTransactionResume(transacao);

}

const appendReceiveResume = transacao => {
  let modal = document.getElementById('receber-resumo');
  modal.innerHTML = '';

  let data = document.createElement('p');
  let valor = document.createElement('p');
  let codigo = document.createElement('p');

  data.innerHTML = `Data: ${getDate(transacao.data)}`;
  valor.innerHTML = `Valor: ${transacao.valor}`;
  codigo.innerHTML = `Codigo: ${transacao.chave.chave}`;

  modal.append(data);
  modal.append(valor);
  modal.append(codigo);

}

const getDataReceive = () => {
  let valor = document.getElementById('receber-valor').value;
  let code = generateRecieveCode();

  let transacao = {
    'tipo': 'recebido',
    'data': new Date(),
    'chave': {
      'tipo': 'gerada',
      'chave': code,
    },
    'banco': conta.banco,
    'valor': parseFloat(valor).toFixed(2)
  };


  return transacao;

}

const makeReceive = () => {
  let transacao = getDataReceive();
  conta.extrato.push(transacao);

  loadTransactions('');

  //resetar form
  document.getElementById('receber-form').reset();

  //carregar resumo
  appendReceiveResume(transacao);
}


const reloadPage = () => {

  var firstTabEl = document.querySelector('#pills-tab li:first-child button')
  var firstTab = new bootstrap.Tab(firstTabEl)

  firstTab.show()
}

const goToTransactions = () => {
  var firstTabEl = document.querySelector('#pills-tab li:last-child button')
  var firstTab = new bootstrap.Tab(firstTabEl)
  //console.log(firstTab);
  firstTab.show()
}

/**--- Init Script --- */
window.onload = loadUserKeys(), loadTransactions();

