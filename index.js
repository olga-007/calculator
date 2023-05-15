// see https://www.theodinproject.com/lessons/foundations-calculator

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

const display = addDiv(container, 'display');
display.textContent = '1234567890';

const buttonBox = addDiv(container, 'button-box');

const digitSection = addDiv(buttonBox, 'digit-box');
for (let i = 2; i >= 0; i--) {
    const row = addDiv(digitSection, 'digit-row');
    for (let j = 0; j < 3; j++) {
        addButton(row, i * 3 + j + 1);
    }
}
const row = addDiv(digitSection, 'digit-row');
addButton(row, 0, 'btn-zero');
const dotBtn = addButton(row, '.');
dotBtn.disabled = true;

const operationSection = addDiv(buttonBox);
['/', '*', '-', '+'].forEach((operation) => {
    addButton(operationSection, operation);
});

const commandSection = addDiv(buttonBox);
const bkspBtn = addButton(commandSection, '\u2190');
bkspBtn.disabled = true;
const clearBtn = addButton(commandSection, 'C');
clearBtn.disabled = true;
addButton(commandSection, '=', 'btn-equals');
