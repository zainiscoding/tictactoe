//Factory functions - for multiple things

//Create the player... ?
const playerFactory = (name, token) => {

    return { name, token }
}



//Modules - for things you only need 1 of

//The gameboard array and interacting with it - clicking the gameboard, etc.

const gameBoardModule = (() => {
    let gameBoardArr = [];


    const setTurn = () => {

        if (gameFlow.turn % 2 == 0) {
            const gridBlocks = document.querySelectorAll(".emptyBlock")
            gridBlocks.forEach((gridBlock) => {
                gridBlock.addEventListener("click", function (e) {
                    gameBoardArr.splice(parseInt(gridBlock.id.charAt(gridBlock.id.length - 1)), 1, "O")
                    gridBlock.setAttribute("class", "oBlock");
                    gridBlock.textContent = "O";
                });
            });
        }


        else {
            const gridBlocks = document.querySelectorAll(".emptyBlock")
            gridBlocks.forEach((gridBlock) => {
                gridBlock.addEventListener("click", function (e) {
                    gameBoardArr.splice(parseInt(gridBlock.id.charAt(gridBlock.id.length - 1)), 1, "X")
                    gridBlock.setAttribute("class", "xBlock");
                    gridBlock.textContent = "X";
                });
            });
        }

    }




    return {
        setTurn,
        gameBoardArr
    }
})();


//Render everything and keep it all up to date
const displayController = (() => {
    const mainArea = document.querySelector("main");
    const gameBoardContainer = document.createElement("div");
    gameBoardContainer.setAttribute("id", "gameBoardContainer")
    const gameBoardElement = document.createElement("div");
    gameBoardElement.setAttribute("id", "gameBoard");

    const playerOneLabel = document.createElement("label");
    playerOneLabel.setAttribute("for", "playerOneName");
    playerOneLabel.textContent = "Player One:";

    const playerOneBox = document.createElement("input");
    playerOneBox.setAttribute("type", "text");
    playerOneBox.setAttribute("id", "playerOneBox")
    playerOneBox.setAttribute("value", "Player One");


    const playerTwoLabel = document.createElement("label");
    playerTwoLabel.setAttribute("for", "playerTwoName");
    playerTwoLabel.textContent = "Player Two:";

    const playerTwoBox = document.createElement("input");
    playerTwoBox.setAttribute("type", "text");
    playerTwoBox.setAttribute("id", "playerTwoBox")
    playerTwoBox.setAttribute("value", "Player Two");

    const savePlayerNamesBtn = document.createElement("button");
    savePlayerNamesBtn.setAttribute("id", "savePlayerNamesBtn");
    savePlayerNamesBtn.textContent = "Save names";

    const startGameBtn = document.createElement("button");
    startGameBtn.setAttribute("id", "startGameBtn");
    startGameBtn.textContent = "Start Game";

    function populateGameBoard() {
        for (let i = 0; i < 9; i++) {
            let gridBlock = document.createElement("div");

            if (gameBoardModule.gameBoardArr[i] === undefined) {
                gridBlock.setAttribute("id", "block " + i);
                gridBlock.setAttribute("class", "emptyBlock");
            }
            if (gameBoardElement.childElementCount < 9) {
                console.log("APPEND")
                gameBoardElement.append(gridBlock)
            }
        }
        return gameBoardElement;
    }

    mainArea.append(playerOneLabel);
    mainArea.append(playerOneBox);
    mainArea.append(playerTwoLabel);
    mainArea.append(playerTwoBox);
    mainArea.append(savePlayerNamesBtn);
    mainArea.append(startGameBtn);

    mainArea.append(gameBoardContainer);
    gameBoardContainer.append(gameBoardElement);

    populateGameBoard();


    return {
        populateGameBoard: populateGameBoard,
    }
})();


//Going to the next round when one player has gone, choosing a player, etc.
const gameFlow = (() => {

    let playerOne = playerFactory(document.querySelector("#playerOneBox").value, "X");
    let playerTwo = playerFactory(document.querySelector("#playerTwoBox").value, "O");


    let setPlayerNames = () => {
        savePlayerNamesBtn.addEventListener("click", (e) => {
            playerOne = playerFactory(document.querySelector("#playerOneBox").value, "X");
            playerTwo = playerFactory(document.querySelector("#playerTwoBox").value, "O");
        });
    }


    let turn = 1;

    const startGame = () => {
        const gridBlocks = document.querySelectorAll(".emptyBlock")
        gridBlocks.forEach((gridBlock) => {
            gridBlock.addEventListener("click", function (e) {
                gameBoardModule.setTurn();
                gameFlow.turn++
            });
        });
    }

    startGame();


    return {
        playerOne, playerTwo, setPlayerNames, turn
    }

})();
