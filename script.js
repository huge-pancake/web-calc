const buttons = {
  number: document.querySelectorAll('[data-act-number]'),
  operator: document.querySelectorAll('[data-act-operator]'),
  action: document.querySelectorAll('[data-act-action]'),
  all: [...document.querySelectorAll('.calculator fat-button')],
};
const ioEl = document.querySelector('.calculator__io-element');
const previewEl = document.querySelector('.calculator__io-preview');
const keyCodeShowing = document.querySelector('.code');
const keyTimesShowing = document.querySelector('.times');

// Maybe '.' is not a number? But this way is easier
const validNum = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '.'];
const validSym = ['+', '-', '×', '÷', '%', '(', ')', '^'];
const validLongSym = ['sqrt(', 'fact('];
const validPositionKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
var unpairedBrackets = 0;

var lastFocus = buttons.all[0];

// For value handling
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

function updatePreview() {
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

  updatePreview();
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

  let oneSymReplacing = validSym.indexOf(lastChar) !== -1;
  let doubleSymReplacing = lastChar2 === '**';

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
      ioEl.textContent += ')';
      unpairedBrackets--;
    } else {
      ioEl.textContent += '(';
      unpairedBrackets++;
    }

    updatePreview();

    // Because the user clicked '()', we don't need to do anything else
    return;
  }

  // If the user wants to replace the last one symbol
  if (oneSymReplacing || doubleSymReplacing) {
    ioEl.textContent = ioEl.textContent.substring(
      0,
      ioEl.textContent.length - 1
    );
  }
  // Anyway, append the symbol
  ioEl.textContent += targetSym;

  updatePreview();
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

    updatePreview();

    return;
  }

  if (targetAct == 'backspace') {
    let lastChar = getValEnding(ioEl.textContent, 1);
    let lastChar5 = getValEnding(ioEl.textContent, 5);

    // If last 5 chars are calculate symbol
    if (validLongSym.includes(lastChar5)) {
      ioEl.textContent = ioEl.textContent.substr(
        0,
        ioEl.textContent.length - 5
      );

      updatePreview();

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
    ioEl.textContent = ioEl.textContent.substring(
      0,
      ioEl.textContent.length - 1
    );

    updatePreview();

    return;
  }

  if (targetAct == 'equal') {
    // If the input is invalid, just tell the user
    try {
      ioEl.textContent = eval(makeValueComputable(ioEl.textContent)) || '';

      updatePreview();
    } catch (error) {
      ioEl.textContent = 'Invalid input';
    }

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
  // For key showing
  let fullKey =
    (e.ctrlKey ? 'Ctrl + ' : '') +
    (e.shiftKey ? 'Shift + ' : '') +
    (e.altKey ? 'Alt + ' : '') +
    (e.key === 'Control' || e.key === 'Shift' || e.key === 'Alt'
      ? 'void'
      : e.key);
  if (keyCodeShowing.textContent === fullKey) {
    keyTimesShowing.textContent = parseInt(keyTimesShowing.textContent) + 1;
  } else {
    keyCodeShowing.textContent = fullKey;
    keyTimesShowing.textContent = 1;
  }

  // If target is button
  let targetButton = document.querySelector(`[data-key-bind~="${e.key}"]`);
  if (targetButton) {
    e.preventDefault();

    targetButton.focus();
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
});

// For custom calculating
window.sqrt = (n) => Math.sqrt(n);
window.fact = (n) => {
  if (n === 0) {
    return 1;
  }
  return n * fact(n - 1);
};
