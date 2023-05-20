/* eslint-disable default-case */
/* eslint-disable indent */
// see https://www.theodinproject.com/lessons/foundations-calculator

const MAX_TOTAL_LENGTH = 28;
const DIVIDE = '/';
const TIMES = '\u00D7';
const SUBTRACT = '-';
const ADD = '+';
const DOT = '.';
const BACKSPACE = '\u2190';
const OPERATIONS = [DIVIDE, TIMES, SUBTRACT, ADD];

let display;
let num1;
let num2;
let currentOp;
let isFinalCalculated;
let isError;

function composeDisplayString() {
    return num1 + currentOp + num2;
}

function updateDisplay() {
    display.textContent = composeDisplayString();
}

function initDisplay() {
    num1 = '';
    num2 = '0';
    currentOp = '';
    isFinalCalculated = false;
    isError = false;
    updateDisplay();
}

function add(a, b) {
    return +a + +b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (+b === 0) {
        return 'Dividing by zero, are we?';
    }
    return a / b;
}

const opFunctions = {
    [DIVIDE]: divide,
    [TIMES]: multiply,
    [SUBTRACT]: subtract,
    [ADD]: add,
};

function applyOperation() {
    const result = opFunctions[currentOp](num1, num2 === '' ? num1 : num2);
    // eslint-disable-next-line no-restricted-globals
    if (!isFinite(result)) {
        isError = true;
    }
    return result.toString();
}

function calculateFinal() {
    if (currentOp) {
        num2 = applyOperation();
        num1 = '';
        currentOp = '';
    } else {
        num2 = (+num2).toString();
    }
    updateDisplay();
    isFinalCalculated = true;
}

function printOperation(opStr) {
    if (!isError && display.textContent.length <= MAX_TOTAL_LENGTH) {
        if (OPERATIONS.includes(display.textContent.at(-1))) {
            currentOp = opStr;
        } else if (currentOp) {
            num1 = applyOperation();
            num2 = '';
            currentOp = isError ? '' : opStr;
        } else {
            num2 = (+num2).toString();

            if (num2.length < MAX_TOTAL_LENGTH - 1) {
                num1 = num2;
                num2 = '';
                currentOp = opStr;
            }
        }
        updateDisplay();
    }
}

function printDigit(digitStr) {
    if (!isError && display.textContent.length < MAX_TOTAL_LENGTH) {
        if (isFinalCalculated) {
            num2 = digitStr; // overwrite
            isFinalCalculated = false;
        } else if (num2 === '0') {
            if (digitStr !== '0') {
                num2 = digitStr;
            }
        } else {
            num2 += digitStr;
        }
        updateDisplay();
    }
}

function printDot() {
    if (!isError && display.textContent.length < MAX_TOTAL_LENGTH) {
        if (isFinalCalculated) {
            // eslint-disable-next-line prefer-template
            num2 = '0' + DOT; // overwrite
            isFinalCalculated = false;
        } else if (!num2.includes(DOT)) {
            let str = DOT;
            if (num2 === '') {
                // eslint-disable-next-line prefer-template
                str = '0' + DOT;
            }
            if (display.textContent.length + str.length <= MAX_TOTAL_LENGTH) {
                num2 += str;
            }
        }
        updateDisplay();
    }
}

function backspace() {
    if (!isError && !isFinalCalculated && num2.length > 0) {
        num2 = num2.slice(0, -1);
        if (composeDisplayString().length === 0) {
            num2 = '0';
        }
        updateDisplay();
    }
}

function addElement(type, parent, cssClass) {
    const element = document.createElement(type);
    if (cssClass) {
        element.classList.add(cssClass);
    }
    parent.appendChild(element);
    return element;
}

function addDiv(parent, cssClass) {
    return addElement('div', parent, cssClass);
}

function addButton(parent, text, cssClass) {
    const button = addElement('button', parent, cssClass);
    button.innerText = text;
    return button;
}

const container = document.getElementById('container');
display = addDiv(container, 'display');

const buttonBox = addDiv(container, 'button-box');

const digitSection = addDiv(buttonBox, 'digit-box');

for (let i = 2; i >= 0; i--) {
    const row = addDiv(digitSection, 'digit-row');
    for (let j = 1; j < 4; j++) {
        const digit = i * 3 + j;
        const btn = addButton(row, digit);
        btn.addEventListener('click', () => printDigit(digit.toString()));
    }
}
const row = addDiv(digitSection, 'digit-row');
const zeroBtn = addButton(row, 0, 'btn-zero');
zeroBtn.addEventListener('click', () => printDigit('0'));

const dotBtn = addButton(row, DOT);
dotBtn.addEventListener('click', printDot);

const operationSection = addDiv(buttonBox);

OPERATIONS.forEach((operation) => {
    const btn = addButton(operationSection, operation);
    btn.addEventListener('click', () => printOperation(operation));
});

const commandSection = addDiv(buttonBox);

const bkspBtn = addButton(commandSection, BACKSPACE, 'btn-bksp');
bkspBtn.addEventListener('click', backspace);

const clearBtn = addButton(commandSection, 'C', 'btn-clear');
clearBtn.addEventListener('click', initDisplay);

const equalsBtn = addButton(commandSection, '=', 'btn-equals');
equalsBtn.addEventListener('click', calculateFinal);

window.addEventListener('keydown', (e) => {
    if (e.code.startsWith('Digit')) {
        printDigit(e.code.at('Digit'.length));
        return;
    }

    if (e.code.startsWith('Numpad')) {
        const numpadCode = e.code.substring('Numpad'.length);
        if (numpadCode.length === 1 && '1234567890'.includes(numpadCode)) {
            printDigit(numpadCode);
            return;
        }
    }

    switch (e.code) {
        case 'NumpadDivide':
        case 'Slash':
            printOperation(DIVIDE);
            break;
        case 'NumpadMultiply':
        case 'KeyX':
            printOperation(TIMES);
            break;
        case 'NumpadSubtract':
        case 'Minus':
            printOperation(SUBTRACT);
            break;
        case 'NumpadAdd':
            printOperation(ADD);
            break;
        case 'NumpadDecimal':
        case 'Period':
            printDot();
            break;
        case 'Backspace':
            backspace();
            break;
        case 'KeyC':
            initDisplay();
            break;
        case 'NumpadEnter':
        case 'Enter':
            calculateFinal();
            break;
    }
});

initDisplay();
