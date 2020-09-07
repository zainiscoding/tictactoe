//Factory functions - for multiple things

//Create the player... ?
const playerFactory = (name, token) => {


    return { name, token }
}

//Modules - for things you only need 1 of

//Render everything and keep it all up to date
const displayController = (() => {
    const mainArea = document.querySelector("main");

    const gameInfo = document.createElement("div");
    gameInfo.setAttribute("id", "gameInfo")

    const gameBoardContainer = document.createElement("div");
    gameBoardContainer.setAttribute("id", "gameBoardContainer")

    const gameBoardElement = document.createElement("div");
    gameBoardElement.setAttribute("id", "gameBoard");

    const playerOneLabel = document.createElement("label");
    playerOneLabel.setAttribute("for", "playerOneName");
    playerOneLabel.textContent = "Player One:";

    const playerOneBox = document.createElement("input");
    playerOneBox.setAttribute("type", "text");
    playerOneBox.setAttribute("id", "playerOneBox");
    playerOneBox.setAttribute("class", "playerBox");
    playerOneBox.setAttribute("value", "Player One");


    const playerTwoLabel = document.createElement("label");
    playerTwoLabel.setAttribute("for", "playerTwoName");
    playerTwoLabel.textContent = "Player Two:";

    const playerTwoBox = document.createElement("input");
    playerTwoBox.setAttribute("type", "text");
    playerTwoBox.setAttribute("id", "playerTwoBox")
    playerTwoBox.setAttribute("class", "playerBox");
    playerTwoBox.setAttribute("value", "Player Two");

    const btnContainer = document.createElement("div");
    btnContainer.setAttribute("id", "btnContainer");

    const savePlayerNamesBtn = document.createElement("button");
    savePlayerNamesBtn.setAttribute("id", "savePlayerNamesBtn");
    savePlayerNamesBtn.setAttribute("class", "button");
    savePlayerNamesBtn.textContent = "Save names";

    const setPlayerNames = () => {
        savePlayerNamesBtn.addEventListener("click", (e) => {
            gameFlow.playerOne = playerFactory(document.querySelector("#playerOneBox").value, "X");
            gameFlow.playerTwo = playerFactory(document.querySelector("#playerTwoBox").value, "O");
        });
    }

    function populateGameBoard() {
        for (let i = 0; i < 9; i++) {
            let gridBlock = document.createElement("div");

            gridBlock.setAttribute("id", "block " + i);
            gridBlock.setAttribute("class", "emptyBlock");

            if (gameBoardElement.childElementCount < 9) {
                gameBoardElement.append(gridBlock)
            }
        }
    }

    function changeGridBlock() {
        const gridBlocks = document.querySelectorAll(".emptyBlock")
        gridBlocks.forEach((gridBlock) => {
            gridBlock.addEventListener("click", function (e) {
                if (gridBlock.getAttribute("class") == "emptyBlock" && gameFlow.turn % 2 == 1 && gameFlow.gameOver == false) {
                    gameBoardModule.getGameBoardArr().splice(parseInt(gridBlock.id.charAt(gridBlock.id.length - 1)), 1, "X")
                    gameFlow.turn++;
                    gridBlock.setAttribute("class", "xBlock");
                    gridBlock.textContent = "X";
                }

                else if (gridBlock.getAttribute("class") == "emptyBlock" && gameFlow.turn % 2 == 0 && gameFlow.gameOver == false) {
                    gameBoardModule.getGameBoardArr().splice(parseInt(gridBlock.id.charAt(gridBlock.id.length - 1)), 1, "O")
                    gameFlow.turn++;
                    gridBlock.setAttribute("class", "oBlock");
                    gridBlock.textContent = "O";
                }
            });
        });
    }

    function restartGameBtnFunction() {
        const restartGameBtn = document.querySelector("#restartGameBtn");
        if (!mainArea.contains(restartGameBtn)) {
            const restartGameBtn = document.createElement("button");
            restartGameBtn.setAttribute("id", "restartGameBtn");
            restartGameBtn.setAttribute("class", "button");
            restartGameBtn.textContent = "Restart";
            savePlayerNamesBtn.insertAdjacentElement("afterend", restartGameBtn)

            restartGameBtn.addEventListener("click", function (e) {
                gameBoardModule.resetGameBoardArr();
                gameBoardElement.innerHTML = "";
                gameBoardContainer.append(gameBoardElement);
                gameFlow.turn = 1;
                gameFlow.gameOver = false;
                restartGameBtn.remove();
                winnerDiv.remove();
                populateGameBoard();
                changeGridBlock();
                gameFlow.endGame();
            });
        }

    }

    function displayWinner(winner) {
        const winnerDiv = document.createElement("div");
        winnerDiv.setAttribute("id", "winnerDiv");
        winnerDiv.textContent = winner + " wins!";
        mainArea.append(winnerDiv);
    }

    gameInfo.append(playerOneLabel);
    gameInfo.append(playerOneBox);
    gameInfo.append(playerTwoLabel);
    gameInfo.append(playerTwoBox);
    btnContainer.append(savePlayerNamesBtn)
    gameInfo.append(btnContainer);

    mainArea.append(gameInfo)

    mainArea.append(gameBoardContainer);
    gameBoardContainer.append(gameBoardElement);

    setPlayerNames();
    populateGameBoard();
    changeGridBlock();

    return { restartGameBtnFunction, displayWinner }

})();


//Going to the next round when one player has gone, choosing a player, etc.
const gameFlow = (() => {

    let turn = 1;
    let gameOver = false;
    let playerOne = playerFactory(document.querySelector("#playerOneBox").value, "X");
    let playerTwo = playerFactory(document.querySelector("#playerTwoBox").value, "O");

    function winPlayerOne() {
        if (gameFlow.gameOver == false) {
            gameFlow.gameOver = true;
            console.log(gameFlow.playerOne.name + " wins!");
            displayController.displayWinner(gameFlow.playerOne.name);

        }
        else {
            return;
        }
    }

    function winPlayerTwo() {
        if (gameFlow.gameOver == false) {
            gameFlow.gameOver = true;
            console.log(gameFlow.playerTwo.name + " wins!");
            displayController.displayWinner(gameFlow.playerTwo.name);

        }
        else {
            return;
        }
    }

    function draw() {
        if (gameFlow.gameOver == false) {
            gameFlow.gameOver = true;
            displayController.displayWinner("Draw. No one");

        }
        else {
            return;
        }
    }

    //Thanks to @ryanford in TOP Discord for this function... It's great!
    function checkLine(grid, val, ...line) {
        return line.map(cell => grid[cell]).every(mark => mark === val);
    }

    function endGame() {
        const gridBlocks = document.querySelectorAll(".emptyBlock")
        gridBlocks.forEach((gridBlock) => {
            gridBlock.addEventListener("click", function (e) {
                if (checkLine(gameBoardModule.getGameBoardArr(), "X", 0, 1, 2) || checkLine(gameBoardModule.getGameBoardArr(), "X", 3, 4, 5)
                    || checkLine(gameBoardModule.getGameBoardArr(), "X", 6, 7, 8) || checkLine(gameBoardModule.getGameBoardArr(), "X", 0, 3, 6) ||
                    checkLine(gameBoardModule.getGameBoardArr(), "X", 1, 4, 7) || checkLine(gameBoardModule.getGameBoardArr(), "X", 2, 5, 8) ||
                    checkLine(gameBoardModule.getGameBoardArr(), "X", 0, 4, 8) || checkLine(gameBoardModule.getGameBoardArr(), "X", 2, 4, 6)) {
                    winPlayerOne();
                    displayController.restartGameBtnFunction();
                }

                else if (checkLine(gameBoardModule.getGameBoardArr(), "O", 0, 1, 2) || checkLine(gameBoardModule.getGameBoardArr(), "O", 3, 4, 5)
                    || checkLine(gameBoardModule.getGameBoardArr(), "O", 6, 7, 8) || checkLine(gameBoardModule.getGameBoardArr(), "O", 0, 3, 6) ||
                    checkLine(gameBoardModule.getGameBoardArr(), "O", 1, 4, 7) || checkLine(gameBoardModule.getGameBoardArr(), "O", 2, 5, 8) ||
                    checkLine(gameBoardModule.getGameBoardArr(), "O", 0, 4, 8) || checkLine(gameBoardModule.getGameBoardArr(), "O", 2, 4, 6)) {
                    winPlayerTwo();
                    displayController.restartGameBtnFunction();
                }

                else if (gameFlow.turn == 10) {
                    draw();
                    displayController.restartGameBtnFunction();
                }


            });
        });
    }

    endGame();


    return {
        turn, gameOver, playerOne, playerTwo, endGame
    }
})();

//The gameboard array and interacting with it - clicking the gameboard, etc.

const gameBoardModule = (() => {
    let gameBoardArr = ["", "", "", "", "", "", "", "", ""];

    const getGameBoardArr = () => gameBoardArr;

    const resetGameBoardArr = () => gameBoardArr = ["", "", "", "", "", "", "", "", ""]

    return {
        getGameBoardArr,
        resetGameBoardArr
    }
})();