//Start Menu
let title, joinButton, makeButton, nameInput, idDisplay, idInput, winnerDisplay;
let startSelect;
let startStatus = 0;
let maker1 = 0;
let callInterval;

let board = [
    ["","",""],
    ["","",""],
    ["","",""]
];

let boardButtons = [
    [],
    [],
    []
];

let extraWindow;

let players = ["X","O"];
let currentPlayer;
let available = [];

//Game Things
let gameID;
let playerName;
let playerNum = 1;
let playerTurn = 1;
let checkMove = 0;
let newBoard = [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""]
];

let player1Name, player2Name;

function setup() {
    let cnv = createCanvas(windowHeight, windowHeight);
    cnv.style('display', 'block');
    background(255);

    currentPlayer = floor(random(players.length));

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            available.push([i,j]);
        }
    }

    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            boardButtons[i][j] = createButton("");
            boardButtons[i][j].class("boardButtons");
            boardButtons[i][j].hide();

            boardButtons[i][j].mousePressed(function () {

                if (playerTurn == playerNum) {
                    board[i][j] = players[playerNum - 1];
                    newBoard[i][j] = board[i][j];
                    let string = "";

                    for (let j = 0; j < 3; j++) {
                        for (let i = 0; i < 3; i++) {
                            string  += board[i][j] == "" ? " " : board[i][j];
                        }
                    }

                    console.log({string, board, newBoard})

                    $.post("./index.php", { start: "sendPos", pos: string}, result => {
                        console.log(result);

                        if (playerTurn == 1) {
                            playerTurn = 2;
                        } else if (playerTurn == 2) {
                            playerTurn = 1;
                        }
                    });
                }
            });
        }
    }

    extraWindow = (windowWidth - windowHeight) / 2;

    //Start Menu
    title = createElement('h1');
    joinButton = createButton('Join Game');
    makeButton = createButton('Create Game');
    nameInput = createInput("Player");
    nameInput.hide();
    idDisplay = createElement('h2');
    idDisplay.hide();
    idInput = createInput("ID");
    idInput.hide();
    winnerDisplay = createElement('h1');
    winnerDisplay.hide();
}

//Game
function equals3(a, b, c) {
    //console.log(a, b, c);
    return (a == b && b == c && a != "" && a != " ");
}

function checkSpotsLeft() {
    let num = 0;
    
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {

            if (board[i][j] == "" || board[i][j] == " " || board[i][j] == null) {
                num++;
            }

        }
    }

    if (num == 0) {
        return true;
    } else {
        return false;
    }
}

function checkWinner() {
    let winner = null;

    //Horizontal
    for (let i = 0; i < 3; i++) {
        //console.log(board);
        if (equals3(board[i][0], board[i][1], board[i][2])) {
            winner = board[i][0];
        }
    }
    //Vertical
    for (let i = 0; i < 3; i++) {
        if (equals3(board[0][i], board[1][i], board[2][i])) {
            winner = board[0][i];
        }
    }
    //Diagonal
    if (equals3(board[0][0], board[1][1], board[2][2])) {
        winner = board[0][0];
    }
    if (equals3(board[2][0], board[1][1], board[0][2])) {
        winner = board[2][0];
    }

    if (winner == null && checkSpotsLeft()) {
        return "Tie!";
    } else {
        return winner;
    }
}

function areListsEqual(list1, list2) {
    let result = true;

    for (let j = 0; j < list1.length; j++) {
        for (let i = 0; i < list1.length; i++) {
            
            if (list1[i][j] != list2[i][j]) {
                if((list1[i][j] == " " || list1[i][j] == "") && (list2[i][j] == " " || list2[i][j] == "")){
                    
                }else{
                    result = false;
                }
            }

        }
    }

    return result;
}

function nextTurn() {
    checkMove = 1;

    if (!areListsEqual(newBoard, board)) {
        console.log(newBoard, board);
        console.log("BRUH 42")
        board = newBoard;

        if (playerTurn == 1) {
            playerTurn = 2;
        } else if (playerTurn == 2) {
            playerTurn = 1;
        }

    }

    /*
    let index = floor(random(available.length));
    let spot = available.splice(index, 1)[0];
    let i = spot[0];
    let j = spot[1];
    board[i][j] = players[currentPlayer];
    currentPlayer = (currentPlayer + 1) % players.length;
    */
}

function displayWinner(result) {
    
    if (result == "Tie!") {
        winnerDisplay.show();
        winnerDisplay.html("It was a draw :(");

    } else {
        if (result == "X") {
            winnerDisplay.show();
            winnerDisplay.html(player1Name + " is the Winner!!");
        } else if (result == "O") {
            winnerDisplay.show();
            winnerDisplay.html(player2Name + " is the Winner!!");
        }
        
    }

    $.post("./index.php", { start: "closeGame" }, result => {
        //console.log(result);

    });

    clearInterval(callInterval);
}

function game() {
    startStatus = 7;

    let w = height / 3;
    let h = height / 3;

    // Draw gird
    line(w, 0, w, height);
    line(w * 2, 0, w * 2, height);
    line(0, h, height, h);
    line(0, h * 2, height, h * 2);

    // Draw X´s, O´s, and board buttons
    for (let j = 0; j < 3; j++) {
        for (let i = 0; i < 3; i++) {
            let x = w * i + w / 2;
            let y = h * j + h / 2;
            let xSize = w / 4;

            if (board[i][j] == "" || board[i][j] == " ") {
                textAlign(CENTER, CENTER);
                boardButtons[i][j].show();
                boardButtons[i][j].position(extraWindow + x, y);
                boardButtons[i][j].size(w, h);
                boardButtons[i][j].style("margin", "-" + (h / 2) + "px -" + (w / 2) + "px");

            } else {
                boardButtons[i][j].hide();

                let spot = board[i][j];
                strokeWeight(4);
                if (spot == players[1]) {
                    noFill();
                    ellipse(x, y, w / 2);
                } else if (spot == players[0]) {
                    
                    line(x - xSize, y - xSize, x + xSize, y + xSize);
                    line(x + xSize, y - xSize, x - xSize, y + xSize);
                }
            }

        }
    }

    let result = checkWinner();
    if (result != null) {
        noLoop();
        displayWinner(result);
        console.log(result);
    } else {
        nextTurn();
    }
}


//Before game
function selectName() {
    startStatus = 4;

    makeButton.remove();
    title.hide();


    nameInput.show();
    nameInput.center();
    playerName = nameInput.value();
    player2Name = playerName;

    joinButton.html("Submit Name");
    joinButton.position(windowWidth / 2, (windowHeight / 2) + 50);
    joinButton.center("horizontal");

    joinButton.mousePressed(function () {
        console.log("Name: " + playerName);
        insertGameID();
    });
}

function insertGameID() {
    startStatus = 5;

    nameInput.remove();

    idInput.show();
    idInput.center();

    gameID = parseInt(idInput.value(), 36) / 6000000;

    joinButton.html("Submit ID");
    joinButton.position(windowWidth / 2, (windowHeight / 2) + 50);
    joinButton.center("horizontal");

    joinButton.mousePressed(function () {
        $.post("./index.php", { start: "joinGame", name: playerName, id: gameID }, result => {
            console.log(result + gameID);

            if (result == "bad id") {
                $.notify("Incorrect Game ID", "error");
            } else {
                playerNum = 2;
                waitingJoin();
            }
        });
    });
}

function waitingJoin() {
    startStatus = 1;

    joinButton.remove();
    makeButton.remove();
    idInput.remove();

    title.show();
    title.html("Waiting to join...");
    title.center();

    callServer();
}

function createGame() {
    startStatus = 2;
    
    makeButton.remove();
    title.hide();
    

    nameInput.show();
    nameInput.center();
    playerName = nameInput.value();
    player1Name = playerName;

    joinButton.html("Submit Name");
    joinButton.position(windowWidth / 2, (windowHeight / 2) + 50);
    joinButton.center("horizontal");

    
    joinButton.mousePressed(function sendCreate(params) {
        if (maker1 == 0) {
            $.post("./index.php", { start: "makeGame", name: nameInput.value() }, result => {
                console.log(result);

                playerNum = 1;
                maker1 = 1;
                waitingForPlayer();
            });
        }
    });
}

function callServer() {

    if(callInterval != null) return;

    callInterval = setInterval(() => {

        console.log("Calling server...");

        //Player 1 waiting for player 2
        if (playerNum == 1 && startStatus == 3) {

            $.post("./index.php", { start: "checkPlayer2" }, result => {
                //console.log(result);

                if (result == "no player2") {
                    console.log("Wait more, your friend will come some day");
                } else {
                    player2Name = result.substring(1);
                    console.log("A friend has been found");
                    startStatus = 6;
                }
            });

        }

        //check for new moves
        if (checkMove == 1 && playerNum != playerTurn) {
            
            $.post("./index.php", { start: "checkPos" }, result => {
                let string = result;
                newBoard = [
                    [string[0], string[3], string[6]],
                    [string[1], string[4], string[7]],
                    [string[2], string[5], string[8]]
                ];
                console.log("Recieved new board.", newBoard, board)
                //console.log(newBoard);

            });

        }

        //Player 2 checking for Player 1
        if (playerNum == 2 && startStatus == 1) {

            $.post("./index.php", { start: "checkPlayer1" }, result => {
                //console.log(result);

                if (result == "no player1") {
                    console.log("IDK where your supposed friend went");
                } else {
                    player1Name = result.substring(1);
                    console.log("A friend has been found");
                    startStatus = 6;
                }
            });

        }

        console.log("Server called.");

    }, 4000);
}

function removeAll() {
    title.remove();
    joinButton.remove();
    makeButton.remove();
    nameInput.remove();
    idDisplay.remove();
    idInput.remove();

    game();
}

function waitingForPlayer() {
    startStatus = 3;
    nameInput.remove();
    joinButton.remove();

    if (maker1 == 1) {
        $.post("./index.php", { start: "checkID" }, result => {
            gameID = result;
            console.log("Game ID: " + gameID);

            var input = document.createElement('input');
            input.value = (gameID * 6000000).toString(36);
            input.id = 'inputID';
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
        
            $.notify("Copied to clipboard", "success");
        });

        maker1 = 2;

        callServer();
    }
    
    title.show();
    title.html("Waiting for another player");
    title.center();

    idDisplay.show();
    idDisplay.html("Game ID: " + (gameID * 6000000).toString(36));
    idDisplay.position(windowWidth / 2, windowHeight / 3);
    idDisplay.center("horizontal");
}

function startMenu() {
    title.html("Tic Tac Toe With The Lads<h1>");
    title.position(windowHeight / 10, windowHeight / 10);
    title.center("horizontal");

    textAlign(CENTER);

    joinButton.position((windowWidth / 4) - 50, windowHeight / 2);
    joinButton.center("vertical");
    joinButton.mousePressed(selectName);

    makeButton.position((windowWidth * 3) / 4 - 150, windowHeight / 2);
    makeButton.center("vertical");
    makeButton.mousePressed(createGame);
}

function draw() {
    
    if (startStatus == 0) {
        startMenu();
    } else if (startStatus == 1) {
        waitingJoin();
    } else if (startStatus == 2) {
        createGame();
    } else if (startStatus == 3) {
        waitingForPlayer();
    } else if (startStatus == 4) {
        selectName();
    } else if (startStatus == 5) {
        insertGameID();
    } else if (startStatus == 6) {
        removeAll();
    } else if (startStatus == 7) {
        game();
    }
    
    
    console.log(startStatus);
}