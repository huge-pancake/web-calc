const numButtons = document.querySelectorAll('[data-num]');
const symButtons = document.querySelectorAll('[data-sym]');
const actButtons = document.querySelectorAll('[data-act]');
const allButtons = [...document.querySelectorAll('.calculator button')];
const inputEl = document.querySelector('.calculator__input-element');
const keyShowing = document.querySelector('.key-showing');

// Maybe '.' is not a number? But this way is easier
const validNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const validSym = ['+', '-', '*', '/', '%', '(', ')'];
let unpairedBrackets = 0;

let lastFocus = allButtons[0];

const autoScroll = () => {
  inputEl.scroll(inputEl.scrollWidth, 0);
};
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

  // Maybe '.' is not a number? It has the accept rule like a symbol
  if (targetVal === '.' && lastChar === '.') {
    acceptJoin = false;
  }

  // Just valid number can be joined
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

  // If there is no anything in the input and the user didn't click '()'
  if (valLen === 0 && targetSym !== '()') {
    return;
  }
  // If the user clicked '()'
  if (targetSym === '()') {
    if (
      (validNum.indexOf(lastChar) !== -1 || lastChar === ')') &&
      unpairedBrackets > 0
    ) {
      inputEl.value += ')';
      unpairedBrackets--;
    } else {
      inputEl.value += '(';
      unpairedBrackets++;
    }
    autoScroll();

    // Because the user clicked '()', we don't need to do anything else
    return;
  }

  // If the user wants to replace the last symbol, delete it
  if (replaceSym && lastChar !== '(' && lastChar !== ')') {
    inputEl.value = inputEl.value.substr(0, inputEl.value.length - 1);
  }
  // Anyway, append the symbol
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
    try {
      inputEl.value = eval(inputEl.value) || '';
    } catch (error) { // If the input is invalid, just tell the user
      inputEl.value = 'ERR';
    }
  }
};
/**
 * Init button
 * @param {HTMLElement} el
 */
const initButton = (el) => {
  el.tabIndex = el.tabIndex ? 0 : -1;
  // TODO: better aria-label
  el.ariaLabel =
    el.getAttribute('data-num') ||
    el.getAttribute('data-sym') ||
    el.getAttribute('data-act');
};

for (const i in numButtons) {
  if (Object.hasOwnProperty.call(numButtons, i)) {
    const el = numButtons[i];
    el.addEventListener('click', tryToAppendNumber);
    initButton(el);
  }
}

for (const i in symButtons) {
  if (Object.hasOwnProperty.call(symButtons, i)) {
    const el = symButtons[i];
    el.addEventListener('click', tryToAppendSymbol);
    initButton(el);
  }
}

for (const i in actButtons) {
  if (Object.hasOwnProperty.call(actButtons, i)) {
    const el = actButtons[i];
    el.addEventListener('click', tryToAct);
    initButton(el);
  }
}

window.addEventListener('keydown', (e) => {
  // For debug
  console.log(e.key);
  keyShowing.textContent = e.key;

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

  if (
    ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].indexOf(e.key) !== -1
  ) {
    realFocus = document.activeElement;
    if (allButtons.indexOf(realFocus) === -1) {
      lastFocus.focus();
    }

    e.preventDefault();
    let nowIndex = allButtons.indexOf(lastFocus);
    let targetIndex;
    if (e.key === 'ArrowUp') {
      targetIndex = nowIndex - 4;
    } else if (e.key === 'ArrowDown') {
      targetIndex = nowIndex + 4;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = nowIndex - 1;
    } else {
      targetIndex = nowIndex + 1;
    }
    if (allButtons[targetIndex]) {
      lastFocus.tabIndex = -1;
      allButtons[targetIndex].tabIndex = 0;
      allButtons[targetIndex].focus();
      lastFocus = allButtons[targetIndex];
    }
  }
});
