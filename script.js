'use strict';

// Elements definition
const buttons = {
  number: document.querySelectorAll('[data-act-number]'),
  operator: document.querySelectorAll('[data-act-operator]'),
  action: document.querySelectorAll('[data-act-action]'),
  all: [...document.querySelectorAll('.calculator fat-button')],
};
const ioEl = document.querySelector('.calculator__io-element');
const previewEl = document.querySelector('.calculator__io-preview');
const keyBoardEl = document.querySelector('.calculator__keyboard');
const keyShowing = {
  name: document.querySelector('.name'),
  times: document.querySelector('.times'),
};

// Calculating restrictions
const validNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const validSym = ['+', '-', '×', '÷', '%', '(', ')', '^'];
const validLongSym = ['sqrt(', 'fact('];
const validPositionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
var unpairedBrackets = 0;

// Focus handling
var lastFocus = buttons.all[0];
var realFocus;

// Value handling
/**
 * @param {string} val
 * @returns {string}
 */
function makeValueComputable(val) {
  val = val.split('×').join('*');
  val = val.split('÷').join('/');
  val = val.split('%').join('/100*');
  val = val.split('^').join('**');
  val = val.split('π').join('Math.PI');

  return val;
}
/**
 * @param {string} val
 * @param {number} targetLen
 * @returns {string}
 */
function getValEnding(val, targetLen) {
  return val.substring(val.length - targetLen, val.length);
}

function handleValueChange() {
  ioEl.scrollTo(0, ioEl.scrollHeight - 126 - 24);
  try {
    previewEl.textContent = eval(makeValueComputable(ioEl.textContent)) || '';
  } catch (error) {
    previewEl.textContent = 'Invalid input';
  }
}

/**
 * @param {MouseEvent} e
 */
function tryToAppendNumber(e) {
  lastFocus = e.target;
  const targetVal = e.target.getAttribute('data-act-number');

  const lastChar = getValEnding(ioEl.textContent, 1);

  let acceptJoin = true;

  if (targetVal === '.' && lastChar === '.') {
    acceptJoin = false;
  }
  if (validLongSym.includes(targetVal)) {
    unpairedBrackets++;
  }

  // Just valid number can be joined
  if (acceptJoin) {
    ioEl.textContent += targetVal;
  }

  handleValueChange();
}
/**
 * @param {MouseEvent} e
 */
function tryToAppendSymbol(e) {
  lastFocus = e.target;
  let targetSym = e.target.getAttribute('data-act-operator');

  let val = ioEl.textContent;
  let valLen = val.length;

  let lastChar = getValEnding(ioEl.textContent, 1);
  let lastChar2 = getValEnding(ioEl.textContent, 2);

  let lastIsBracket = lastChar === '(' || lastChar === ')';
  let oneSymReplacing = validSym.includes(lastChar) && !lastIsBracket;
  let doubleSymReplacing = lastChar2 === '**';

  // If there is no anything in the input and the user didn't click '()'
  if (valLen === 0 && targetSym !== '()') {
    return;
  }
  // If the user clicked '()'
  if (targetSym === '()') {
    if ((validNum.indexOf(lastChar) !== -1 || lastChar === ')') && unpairedBrackets > 0) {
      ioEl.textContent += ')';
      unpairedBrackets--;
    } else {
      ioEl.textContent += '(';
      unpairedBrackets++;
    }

    handleValueChange();

    // Because the user clicked '()', we don't need to do anything else
    return;
  }

  // If the user wants to replace the last one symbol
  if ((oneSymReplacing || doubleSymReplacing) && !lastIsBracket) {
    ioEl.textContent = ioEl.textContent.substring(0, ioEl.textContent.length - 1);
  }
  // Anyway, append the symbol
  ioEl.textContent += targetSym;

  handleValueChange();
}
/**
 * @param {MouseEvent} e
 */
function tryToAct(e) {
  lastFocus = e.target;
  let targetAct = e.target.getAttribute('data-act-action');

  if (targetAct == 'clear') {
    ioEl.textContent = '';
    unpairedBrackets = 0;

    handleValueChange();

    return;
  }

  if (targetAct == 'backspace') {
    let lastChar = getValEnding(ioEl.textContent, 1);
    let lastChar5 = getValEnding(ioEl.textContent, 5);

    // If last 5 chars are calculate symbol
    if (validLongSym.includes(lastChar5)) {
      ioEl.textContent = ioEl.textContent.substring(0, ioEl.textContent.length - 5);

      handleValueChange();

      return;
    }

    // When there is a bracket
    if (lastChar === '(') {
      unpairedBrackets--;
    }
    if (lastChar === ')') {
      unpairedBrackets++;
    }

    // Default
    ioEl.textContent = ioEl.textContent.substring(0, ioEl.textContent.length - 1);

    handleValueChange();

    return;
  }

  if (targetAct == 'equal') {
    // If the input is invalid, just tell the user
    try {
      ioEl.textContent = eval(makeValueComputable(ioEl.textContent)) || '';

      handleValueChange();
    } catch (error) {}

    return;
  }
}

// Buttons init
buttons.number.forEach((el) => {
  el.addEventListener('click', tryToAppendNumber);
});
buttons.operator.forEach((el) => {
  el.addEventListener('click', tryToAppendSymbol);
});
buttons.action.forEach((el) => {
  el.addEventListener('click', tryToAct);
});

// Global keydown event listening
window.addEventListener('keydown', (e) => {
  let fullKey =
    (e.ctrlKey ? 'Ctrl+' : '') +
    (e.shiftKey ? 'Shift+' : '') +
    (e.altKey ? 'Alt+' : '') +
    (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt' ? 'void' : e.key);
  if (keyShowing.name.textContent === fullKey) {
    keyShowing.times.textContent = parseInt(keyShowing.times.textContent) + 1;
  } else {
    if (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt') {
      return;
    }
    keyShowing.name.textContent = fullKey;
    keyShowing.times.textContent = 1;
  }

  // If target is button
  let targetButton = document.querySelector(`[data-key-bind~="${fullKey}"]`);
  if (targetButton) {
    e.preventDefault();

    targetButton.click();

    return;
  }

  // If target is position
  if (validPositionKeys.includes(e.key)) {
    e.preventDefault();

    realFocus = document.activeElement;
    if (buttons.all.includes(realFocus)) {
      lastFocus = realFocus;
    }

    let nowIndex = buttons.all.indexOf(lastFocus);
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
    if (buttons.all[targetIndex]) {
      buttons.all[targetIndex].focus();
      lastFocus = buttons.all[targetIndex];
    }
  }

  if (e.key === 'k') {
    e.preventDefault();

    toggleKeyBoard();
  }

  // moo
  if (e.key === 'm') {
    e.preventDefault();
    moo();

    return;
  }
  if (e.key === 'M') {
    e.preventDefault();
    Moo();

    return;
  }
});

// For custom calculating
window.sqrt = (n) => Math.sqrt(n);
window.fact = (n) => {
  if (n === 0) {
    return 1;
  }
  return n * fact(n - 1);
};

function toggleKeyBoard() {
  if (keyBoardEl.hasAttribute('hidden')) {
    keyBoardEl.removeAttribute('hidden');
  } else {
    keyBoardEl.setAttribute('hidden', '');
  }
}

// moo
var Mooed = false;
function initMoo() {
  ioEl.style.display = 'none';
  previewEl.style.padding = '0 12px';
  previewEl.style.height = '100%';
  previewEl.style.textAlign = 'left';
  previewEl.style.justifyContent = 'left';
  previewEl.style.fontSize = '0.75rem';
}
/**
 * @param {string} key
 */
function unMoo(key) {
  setTimeout(() => {
    ioEl.removeAttribute('style');
    previewEl.removeAttribute('style');
    handleValueChange();
    keyShowing.name.textContent = key;
  }, 2000);
}
function moo() {
  initMoo();
  keyShowing.name.textContent = 'You pressed "m"';
  previewEl.innerHTML = `
<pre>* Text from 'm'
This web-calc has Super Cow Power.${Mooed ? '\n(or Super Koala Power?)' : ''}
- I'm ${Mooed ? 'not sure now' : 'sure'}
To active it maybe press this key with
"Sh..".. gosh, I slipped it out!
</pre>`;
  unMoo('m');
}
function Moo() {
  Mooed = true;
  initMoo();
  keyShowing.name.textContent = 'So now we know this web-calc has Super Koala Power, not Super Cow Power, right? But "m" won\'t know.';
  previewEl.innerHTML = `
<pre>* Text from 'M'
"Uh... It's Super Koala...
Not Super Cow..."
         ___
       {~._.~}
        ( Y )
       ()~*~()
       (_)-(_)
"Have you mooed...uh, wait,
 what's the cry of koala?"
</pre>`;
  unMoo('Shift+M');
}
