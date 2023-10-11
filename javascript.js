let buttons = document.querySelectorAll(".calculator_key");
let display = document.querySelector(".calculator_display");
let value;



function isOperator(lastChar) {
    const operators = ['+', '-', '*', '/'];
    return operators.includes(lastChar);
}

function calculateResult(expression){
    try{
        return math.evaluate(expression);
    } 
    catch(error) {
        return "ERROR"
    }

}

buttons.forEach(function(button) {
    button.addEventListener("click", function (event){

        let numberstr = event.target.getAttribute("data-number");
        let operation = event.target.getAttribute("data-operation");
        let deleteAction = event.target.getAttribute("data-delete");

        if (numberstr) {
            if (numberstr === "."){
                if (!display.textContent.includes(".")){
                    display.append(".");
            }
        }
            else {

                display.textContent = display.textContent === "0" ? numberstr : display.textContent + numberstr;
                    
                }
            }

        else if (operation) {
            let lastChar = display.textContent.slice(-1);
            if (!isOperator(lastChar) && operation != "=") {
                display.append(operation);
                
            }
            else if (operation === "="){
                display.textContent = calculateResult(display.textContent);
            }
        }

        else if (deleteAction === "true"){
            
            display.textContent = 0;

        }

    });



});