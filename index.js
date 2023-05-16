// see https://www.theodinproject.com/lessons/foundations-calculator

const MAX_TOTAL_LENGTH = 27;

let display;

function initDisplay() {
    display.textContent = '0';
}

function printDigit() {
    if (display.textContent.length < MAX_TOTAL_LENGTH) {
        if (display.textContent === '0') {
            if (this.innerText !== '0') {
                display.textContent = this.innerText;
            }
        } else {
            display.textContent += this.innerText;
        }
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

const dotBtn = addButton(row, '.');
dotBtn.disabled = true;

const operationSection = addDiv(buttonBox);

['/', '*', '-', '+'].forEach((operation) => {
    const btn = addButton(operationSection, operation);
    btn.disabled = true;
});

const commandSection = addDiv(buttonBox);

const bkspBtn = addButton(commandSection, '\u2190', 'btn-bksp');
bkspBtn.disabled = true;

const clearBtn = addButton(commandSection, 'C', 'btn-clear');
clearBtn.addEventListener('click', initDisplay);

const equalsBtn = addButton(commandSection, '=', 'btn-equals');
equalsBtn.disabled = true;

initDisplay();
