const buttons = document.querySelectorAll(".calculator_key");
const display = document.querySelector(".calculator_display");
const originalFontSize = window.getComputedStyle(display).fontSize;
let lastOperationWasEqual = false;



function resetFontSize(element) {
    element.style.fontSize = originalFontSize;
}

function adjustFontSize(element) {

    const MAX_WIDTH = element.clientWidth;
    

    while (element.scrollWidth > MAX_WIDTH) {
        let currentSizePercentage = parseFloat(window.getComputedStyle(element).fontSize) / parseFloat(window.getComputedStyle(element.parentElement).fontSize) * 100;
        element.style.fontSize = (currentSizePercentage - 10) + "%";  // Decrease by 10% each iteration
    }

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
    let lastChar = display.textContent.trim().slice(-1);
    
    if ((!isOperator(lastChar)  || lastOperationWasEqual) && operation !== "=" ) {
        display.append(" " + operation + " ");
        lastOperationWasEqual = false;
    } 
    
    else if (operation === "=") {
        display.textContent = calculateResult(display.textContent);
        resetFontSize(display);
        lastOperationWasEqual = true;
    }
}

function calculateResult(expression) {
    try {
        let expressionArray = expression.split(" ");  
           
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