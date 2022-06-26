const numButtons = document.querySelectorAll('[data-num]');
const symButtons = document.querySelectorAll('[data-sym]');
const actButtons = document.querySelectorAll('[data-act]');
const inputEl = document.querySelector('.calculator__input-element');

const validNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const validSym = ['+', '-', '*', '/', '%', '(', ')'];

const autoScroll = () => {
  inputEl.scroll(inputEl.scrollWidth, 0);
}
/**
 * Try to append a number
 * @param {MouseEvent} e
 */
const tryToAppendNumber = (e) => {
  const targetVal = e.target.getAttribute('data-num');
  const val = inputEl.value.split('');
  const valLen = val.length;
  const lastChar = val[valLen - 1];
  let acceptJoin = true;

  // Maybe '.' is not a number? It has the accept rule like a symbol now.
  if (targetVal === '.' && lastChar === '.') {
    acceptJoin = false;
  }

  if (acceptJoin) {
    inputEl.value += targetVal;
  }

  autoScroll();
};
/**
 * Try to append a symbol
 * @param {MouseEvent} e
 */
const tryToAppendSymbol = (e) => {
  const targetSym = e.target.getAttribute('data-sym');
  const val = inputEl.value.split('');
  const valLen = val.length;
  const lastChar = val[valLen - 1];
  const replaceSym = validSym.indexOf(lastChar) === -1 ? false : true;

  if (valLen === 0) {
    return;
  }
  if (targetSym === '()') {
    if (validNum.indexOf(lastChar) !== -1) {
      inputEl.value += ')';
    } else {
      inputEl.value += '(';
    }
    return;
  }

  if (replaceSym && lastChar !== '(' && lastChar !== ')') {
    inputEl.value = inputEl.value.substr(0, inputEl.value.length - 1);
  }
  inputEl.value += targetSym;

  autoScroll();
};
/**
 * Try to act
 * @param {MouseEvent} e
 */
const tryToAct = (e) => {
  const targetAct = e.target.getAttribute('data-act');

  if (targetAct == 'clear') {
    inputEl.value = '';
  } else if (targetAct == 'backspace') {
    inputEl.value = inputEl.value.substr(0, inputEl.value.length - 1);
  } else if (targetAct == 'query') {
    inputEl.value = eval(inputEl.value) || '';
  }
};

for (const i in numButtons) {
  if (Object.hasOwnProperty.call(numButtons, i)) {
    const el = numButtons[i];
    el.addEventListener('click', tryToAppendNumber);
  }
}

for (const i in symButtons) {
  if (Object.hasOwnProperty.call(symButtons, i)) {
    const el = symButtons[i];
    el.addEventListener('click', tryToAppendSymbol);
  }
}

for (const i in actButtons) {
  if (Object.hasOwnProperty.call(actButtons, i)) {
    const el = actButtons[i];
    el.addEventListener('click', tryToAct);
  }
}

window.addEventListener('keydown', (e) => {
  // For debug
  console.log(e.key);

  // TODO: Add support for ()
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
