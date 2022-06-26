const arrNum = document.querySelectorAll('[data-num]');
const arrSym = document.querySelectorAll('[data-sym]');
const arrAct = document.querySelectorAll('[data-act]');
const elInput = document.querySelector('.calculator__input-element');

const validNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const validSym = ['+', '-', '*', '/', '%', '(', ')'];

/**
 * Try to append a number
 * @param {MouseEvent} e
 */
const tryToAppendNumber = (e) => {
  const targetVal = e.target.getAttribute('data-num');
  const val = elInput.value.split('');
  const valLen = val.length;
  const lastChar = val[valLen - 1];
  let acceptJoin = true;

  if (acceptJoin) {
    elInput.value += targetVal;
  }
};
/**
 * Try to append a symbol
 * @param {MouseEvent} e
 */
const tryToAppendSymbol = (e) => {
  const targetSym = e.target.getAttribute('data-sym');
  const val = elInput.value.split('');
  const valLen = val.length;
  const lastChar = val[valLen - 1];
  const replaceSym = validSym.indexOf(lastChar) === -1 ? false : true;

  if (valLen === 0) {
    return;
  }
  if (targetSym === '()') {
    if (validNum.indexOf(lastChar) !== -1) {
      elInput.value += ')';
    } else {
      elInput.value += '(';
    }
    return;
  }

  if (replaceSym) {
    elInput.value = elInput.value.substr(0, elInput.value.length - 1);
  }
  elInput.value += targetSym;
};
/**
 * Try to act
 * @param {MouseEvent} e
 */
const tryToAct = (e) => {
  const targetAct = e.target.getAttribute('data-act');

  if (targetAct == 'clear') {
    elInput.value = '';
  } else if (targetAct == 'backspace') {
    elInput.value = elInput.value.substr(0, elInput.value.length - 1);
  } else if (targetAct == 'query') {
    elInput.value = eval(elInput.value) || '';
  }
};

for (const i in arrNum) {
  if (Object.hasOwnProperty.call(arrNum, i)) {
    const el = arrNum[i];
    el.addEventListener('click', tryToAppendNumber);
  }
}

for (const i in arrSym) {
  if (Object.hasOwnProperty.call(arrSym, i)) {
    const el = arrSym[i];
    el.addEventListener('click', tryToAppendSymbol);
  }
}

for (const i in arrAct) {
  if (Object.hasOwnProperty.call(arrAct, i)) {
    const el = arrAct[i];
    el.addEventListener('click', tryToAct);
  }
}

window.addEventListener('keydown', (e) => {
  console.log(e.key);
  if (e.key === 'Enter') {
    e.preventDefault();
    document.querySelector('[data-act="query"]').click();
  } else if (e.key === 'Escape') {
    e.preventDefault();
    document.querySelector('[data-act="clear"]').click();
  } else if (e.key === 'Backspace') {
    e.preventDefault();
    document.querySelector('[data-act="backspace"]').click();
  } else if (validNum.indexOf(e.key) !== -1) {
    e.preventDefault();
    document.querySelector(`[data-num="${e.key}"]`).click();
  } else if (validSym.indexOf(e.key) !== -1) {
    e.preventDefault();
    document.querySelector(`[data-sym="${e.key}"]`).click();
  }
});
