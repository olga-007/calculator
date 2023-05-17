// see https://www.theodinproject.com/lessons/foundations-calculator

const MAX_TOTAL_LENGTH = 27;
const TIMES = '\u00D7';
const DOT = '.';
const BACKSPACE = '\u2190';
const OPERATIONS = ['/', TIMES, '-', '+'];

let display;
let num1;
let num2;
let currentOp;
let isFinalCalculated;
let isError;

function updateDisplay() {
    display.textContent = num1 + currentOp + num2;
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
    '/': divide,
    [TIMES]: multiply,
    '-': subtract,
    '+': add,
};

function applyOperation() {
    const result = opFunctions[currentOp](num1, num2 === '' ? num1 : num2);
    // eslint-disable-next-line no-restricted-globals
    if (isNaN(result)) {
        isError = true;
    }
    return result.toString();
}

function calculateFinal() {
    if (currentOp) {
        num2 = applyOperation();
        num1 = '';
        currentOp = '';
        updateDisplay();
    }
    isFinalCalculated = true;
}

function printOperation() {
    if (!isError && display.textContent.length < MAX_TOTAL_LENGTH) {
        if (!OPERATIONS.includes(display.textContent.at(-1))) {
            num1 = currentOp ? applyOperation() : num2;
            if (num1.endsWith(DOT)) {
                num1 = num1.slice(0, -DOT.length);
            }
            num2 = '';
        }
        currentOp = isError ? '' : this.innerText;
        updateDisplay();
    }
}

function printDigit() {
    if (!isError && display.textContent.length < MAX_TOTAL_LENGTH) {
        if (isFinalCalculated) {
            num2 = this.innerText; // overwrite
            isFinalCalculated = false;
        } else if (num2 === '0') {
            if (this.innerText !== '0') {
                num2 = this.innerText;
            }
        } else {
            num2 += this.innerText;
        }
        updateDisplay();
    }
}

function printDot() {
    if (!isError && display.textContent.length < MAX_TOTAL_LENGTH && !num2.includes(DOT)) {
        let str = DOT;
        if (num2 === '') {
            // eslint-disable-next-line prefer-template
            str = '0' + DOT;
        }
        if (isFinalCalculated) { // overwrite
            num2 = str;
            isFinalCalculated = false;
        } else if (display.textContent.length + str.length <= MAX_TOTAL_LENGTH) {
            num2 += str;
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
    for (let j = 0; j < 3; j++) {
        const btn = addButton(row, i * 3 + j + 1);
        btn.addEventListener('click', printDigit);
    }
}
const row = addDiv(digitSection, 'digit-row');
const zeroBtn = addButton(row, 0, 'btn-zero');
zeroBtn.addEventListener('click', printDigit);

const dotBtn = addButton(row, DOT);
dotBtn.addEventListener('click', printDot);

const operationSection = addDiv(buttonBox);

OPERATIONS.forEach((operation) => {
    const btn = addButton(operationSection, operation);
    btn.addEventListener('click', printOperation);
});

const commandSection = addDiv(buttonBox);

const bkspBtn = addButton(commandSection, BACKSPACE, 'btn-bksp');
bkspBtn.disabled = true;

const clearBtn = addButton(commandSection, 'C', 'btn-clear');
clearBtn.addEventListener('click', initDisplay);

const equalsBtn = addButton(commandSection, '=', 'btn-equals');
equalsBtn.addEventListener('click', calculateFinal);

initDisplay();
