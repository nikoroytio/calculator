const buttons = document.querySelectorAll(".calculator_key");
const display = document.querySelector(".calculator_display");
const originalFontSize = window.getComputedStyle(display).fontSize;
let lastOperationWasEqual = false;

let storedValue = null;
let storedOperator = null;


function resetFontSize(element) {
    element.style.fontSize = originalFontSize;
}

//don´t try to add padding in here, breaks in infinite loop somehow//
function adjustFontSize(element) {

    const MAX_WIDTH = element.clientWidth;
    

    while (element.scrollWidth > MAX_WIDTH) {
        let currentSizePercentage = parseFloat(window.getComputedStyle(element).fontSize) / parseFloat(window.getComputedStyle(element.parentElement).fontSize) * 100;
        element.style.fontSize = (currentSizePercentage - 20) + "%";  // Decrease by 10% each iteration
    }

}

function isDisplayMaxLength() {
    return display.textContent.replace(/\s+/g, '').length >= 7; // Remove spaces and check length
}

function isOperator(char) {
    const operators = ['+', '-', '*', '/', '='];
    return operators.includes(char.trim());
}


function currentNumberHasDot() {
    const parts = display.textContent.split(' ');
    const currentNumber = parts[parts.length - 1];
    return currentNumber.includes('.');
}

function handleNumberInput(numberstr) {
    if (isDisplayMaxLength()) return;

    if (isOperator(display.textContent.trim())) {
        display.textContent = ""; // Clear the display if it currently shows an operator
        lastOperationWasEqual = false; // Reset this flag as we're starting a new operation
    }

    if (numberstr === ".") {
        if (!currentNumberHasDot()) {
            display.append(".");
        }
    }
    
    else if(lastOperationWasEqual){
        return;
    }

    else {
        display.textContent = display.textContent === "0" ? numberstr : display.textContent + numberstr;
    }
}

function handleOperation(operation) {

    if (operation !== "=") {
        if (!lastOperationWasEqual) {
            storedValue = parseFloat(display.textContent); // Store the current value
        } else {
            storedValue = display.textContent;
            lastOperationWasEqual = false;
        }
        storedOperator = operation; // Store the operator
        display.textContent = operation;
    } else {
        const expression = `${storedValue} ${storedOperator} ${display.textContent}`;
        display.textContent = calculateResult(expression);
        resetFontSize(display);
        lastOperationWasEqual = true;

        // Reset stored operator after calculation, but keep the storedValue for further calculations
        storedOperator = null;
    }
}

function calculateResult(expression) {
    try {
        let expressionArray = expression.split(" ");  

        // If we only have a single value, return it as the result
        if (expressionArray.length === 1) {
            return expressionArray[0];
        }

        let result = evaluateExpression(expressionArray);

        if (typeof result === "number" && result.toString().includes(".")) {
            return Math.round(result * 1000) / 1000;  
        }

        return result;
    } catch (error) {
        return "ERROR";
    }
}

function evaluateExpression(expressionArray) {
    let currentResult = parseFloat(expressionArray[0]);

    for (let i = 1; i < expressionArray.length; i += 2) {
        const operator = expressionArray[i];
        const number = parseFloat(expressionArray[i + 1]);

        switch (operator) {
            case '+':
                currentResult += number;
                break;
            case '-':
                currentResult -= number;
                break;
            case '*':
                currentResult *= number;
                break;
            case '/':
                if (number !== 0) {
                    currentResult /= number;
                } else {
                    return "Error: Divide by 0";
                }
                break;
            default:
                return "Error: Invalid Operator";
        }
    }

    return currentResult;
}

buttons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        let numberstr = event.target.getAttribute("data-number");
        let operation = event.target.getAttribute("data-operation");
        let deleteAction = event.target.getAttribute("data-delete");

        if (numberstr) {
            handleNumberInput(numberstr);
            adjustFontSize(display);
        } else if (operation) {
            handleOperation(operation);
            adjustFontSize(display);
        } else if (deleteAction === "true") {
            display.textContent = "0";     
            lastOperationWasEqual = false;
            resetFontSize(display);
        }
    });
});