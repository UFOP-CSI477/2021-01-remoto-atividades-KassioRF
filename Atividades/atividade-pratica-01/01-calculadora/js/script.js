/** Add click event in calc buttons */
const display = document.getElementById('display');
const opDisplay = document.getElementById('op-display');

const backspace = document.getElementById('backspace');
const result = document.getElementById('result-btn');
const reset = document.getElementById('reset')

const pow = document.getElementById('pow');
const square = document.getElementById('square');
const percent = document.getElementById('percent');

const values = document.querySelectorAll('.btn-value');
const operators = document.querySelectorAll('.operator');


var a = 0;
var b = 0;

var currentOp = ''
var curr_result = 0;

/** -- Init app events -- */
backspace.addEventListener('click', () => {
  display.value = display.value.slice(0, -1);

});
reset.addEventListener('click', () => {
  console.log('click')
  display.value = '';
  opDisplay.innerHTML = "";
})
/** -- Buttons events */
values.forEach(btn => {
  btn.addEventListener('click', () => {
    printValue(btn);

  });
});

operators.forEach(btn => {
  btn.addEventListener('click', () => {
    if ((btn.value == '+'
      || btn.value == '-'
      || btn.value == 'x'
      || btn.value == '÷')
    ) {

      addOperator(btn.value)
    }


  });
});


result.addEventListener('click', () => {
  if (opDisplay.innerHTML.length > 0 && display.value.length > 0) {
    op = opDisplay.innerHTML[opDisplay.innerHTML.length - 1];
    a = opDisplay.innerHTML.slice(0, -1);
    b = display.value;

    res = makeOperation(a, b, op);
    opDisplay.innerHTML = `${res} ${op}`;
    display.value = "";

  }
})


pow.addEventListener('click', () => {
  if (display.value.length > 0) {
    opDisplay.innerHTML = `${get_pow(display.value)}  `;
    display.value = ''
  }
})

square.addEventListener('click', () => {
  if (display.value.length > 0) {
    opDisplay.innerHTML = `${get_square(display.value)}  `;
    display.value = ''
  }
})

percent.addEventListener('click', () => {
  if (opDisplay.innerHTML.length > 0) {
    op = opDisplay.innerHTML[opDisplay.innerHTML.length - 1];
    a = opDisplay.innerHTML.slice(0, -1);
    b = display.value;

    b = get_percent(a, b);

    res = makeOperation(a, b, op);

    opDisplay.innerHTML = `${res} ${op}`;
    display.value = ''
  } else {
    display.value = '0'
  }
})

/** -- Display input values -- */
var continue_op = true;
const printValue = e => {


  let invalidComma = false;


  if (e.value == '.') {
    for (let i in display.value) {
      if (display.value[i] == '.') {
        invalidComma = true;
      }
    }
  }

  if (!invalidComma) {
    display.value += e.value;
  }
}

/** Start operation */
const addOperator = op => {



  if (display.value.length > 0) {
    if (opDisplay.innerHTML.length > 0) {
      a = opDisplay.innerHTML.slice(0, -1);
      b = display.value
      display.value = makeOperation(a, b, op)

    }

    opDisplay.innerHTML = `${display.value} ${op}`;
    display.value = "";
    //a = display.value;
  }

  if (display.value.length == 0 && opDisplay.innerHTML.length > 0) {
    opDisplay.innerHTML = opDisplay.innerHTML.slice(0, -1);
    console.log(opDisplay.innerHTML);
    opDisplay.innerHTML += ` ${op}`;
  }

}

/** Make operation */
const makeOperation = (a, b, op) => {
  a = parseFloat(a);
  b = parseFloat(b);


  if (op == '+') {
    return a + b;
  }
  if (op == '-') {
    return a - b;
  }
  if (op == 'x') {
    return a * b;
  }
  if (op == '÷') {
    return a / b;
  }

}

/** Especial operations */
const get_pow = a => {
  a = parseFloat(a);

  return a * a;
}

const get_square = a => {
  a = parseFloat(a);

  return Math.sqrt(a);
}

const get_percent = (a, b) => {
  a = parseFloat(a);


  return a * (b / 100);
}


