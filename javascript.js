let buttons = document.querySelectorAll(".calculator_key");
let display = document.querySelector(".calculator_display");
let lastOperationWasEqual = false;

function isOperator(char) {
    const operators = ['+', '-', '*', '/', '='];
    return operators.includes(char);
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
        display.textContent = calculateResult(display.textContent);
    }

    else {
        display.textContent = display.textContent === "0" ? numberstr : display.textContent + numberstr;
    }
}

function handleOperation(operation) {
    let lastChar = display.textContent.slice(-1);
    if (!isOperator(lastChar) && operation !== "=" || lastOperationWasEqual && operation !== "=" ) {
        display.append(" " + operation + " ");
        lastOperationWasEqual = false;
    } 
    
    else if (operation === "=") {
        display.textContent = calculateResult(display.textContent);
        lastOperationWasEqual = true;
    }
}

function calculateResult(expression) {
    try {
        return math.round(math.evaluate(expression), 3);
    } catch (error) {
        return "ERROR";
    }
}

buttons.forEach(function(button) {
    button.addEventListener("click", function(event) {
        let numberstr = event.target.getAttribute("data-number");
        let operation = event.target.getAttribute("data-operation");
        let deleteAction = event.target.getAttribute("data-delete");

        if (numberstr) {
            handleNumberInput(numberstr);
        } else if (operation) {
            handleOperation(operation);
        } else if (deleteAction === "true") {
            display.textContent = "0";
            lastOperationWasEqual = false;
        }
    });
});