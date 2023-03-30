const inputs = document.querySelectorAll(".input-field");
const solveButton = document.getElementById("button");
const resetButton = document.getElementById("reset-button");
const message = document.querySelector(".message h1");
const closeButton = document.querySelector(".close-button");
const instructionsDiv = document.querySelector(".instructions");


const sampleInput = `0 4 0 0 0 0 1 7 9 
0 0 2 0 0 8 0 5 4 
0 0 6 0 0 5 0 0 8 
0 8 0 0 7 0 9 1 0 
0 5 0 0 9 0 0 3 0 
0 1 9 0 6 0 0 4 0 
3 0 0 4 0 0 7 0 0 
5 7 0 1 0 0 2 0 0 
9 2 8 0 0 0 0 6 0`;

let possible = false;
let resetSudoku = false;

window.addEventListener("load", setSampleInput);

closeButton.addEventListener("click", () => {
    instructionsDiv.style.display = "none";
})

solveButton.addEventListener("click", async () => {
    let userInput = new Array(9).fill(0).map(row => new Array(9).fill(0));
    let emptyCells = [];
    for (let i = 0; i < inputs.length; i++) {
        let [row, column] = inputs[i].name.split("").map(Number);
        let charCode = inputs[i].value.charCodeAt(0);
        if (inputs[i].value == "" || (charCode < 48 && charCode > 57) || inputs[i].value.length > 1) {
            userInput[row][column] = 0;
        } else {
            userInput[row][column] = +inputs[i].value;
        }
    }
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (userInput[i][j] == 0) {
                emptyCells.push([i, j]);
                inputs[9 * i + j].value = "";
            } else {
                inputs[9 * i + j].value = userInput[i][j];
            }
            inputs[9 * i + j].disabled = true;
            // inputs[9 * i + j].color = "black";
        }
    }


    solveButton.style.pointerEvents = "none"
    resetButton.style.pointerEvents = "none"

    possible = await solve(emptyCells, userInput, 0);

    if (possible) {
        message.textContent = "Hurray!!"
    } else {
        message.textContent = "No solution is available..."
    }

    solveButton.style.pointerEvents = "all"
    resetButton.style.pointerEvents = "all"
})


async function solve(emptyCellsArray, userInput, emptyCellsIndex) {
    if (emptyCellsIndex == emptyCellsArray.length) return true;
    let [row, column] = emptyCellsArray[emptyCellsIndex];
    // let flag = false;
    for (let i = 1; i < 10; i++) {
        let temp = conflict(userInput, row, column, i);
        if (!temp) {
            userInput[row][column] = i;
            inputs[9 * row + column].style.color = 'crimson';
            await delay(10);
            inputs[9 * row + column].value = userInput[row][column];
            possible = await solve(emptyCellsArray, userInput, emptyCellsIndex + 1);
            if (possible) return true;
            else {
                await delay(10);
                inputs[9 * row + column].value = '';
                userInput[row][column] = 0;
            }
        }
    }
    return false;
}


function conflict(array, row, column, number) {
    for (let i = 0; i < 9; i++) {
        if (array[row][i] === number) {
            return true;
        }
        if (array[i][column] === number) {
            return true;
        }
    }
    let squareStartRow = Math.floor(row / 3) * 3;
    let squareStartColumn = Math.floor(column / 3) * 3;

    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            if (array[squareStartRow + i][squareStartColumn + j] === number) {
                return true;
            }
        }
    }
    return false;
}


resetButton.addEventListener("click", () => {
    resetSudoku = true;
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            inputs[9 * i + j].disabled = false;
        }
    }
    setSampleInput();
})


function setSampleInput() {
    let sample = sampleInput.trim().split("\n");
    let sampleValues = [];
    for (let i = 0; i < 9; i++) {
        sampleValues[i] = sample[i].trim().split(" ").map(Number);
    }
    for (i = 0; i < 9; i++) {
        for (j = 0; j < 9; j++) {
            inputs[9 * i + j].value = sampleValues[i][j];
            if (inputs[9 * i + j].value != 0) {
                inputs[9 * i + j].style.color = 'black';
            } else {
                inputs[9 * i + j].style.color = 'crimson';
            }
        }
    }
}



function delay(delayTime) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve();
        }, delayTime);
    });
}