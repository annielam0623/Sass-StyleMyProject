// chessboard;
// line across the board;
// Black & White stone;
// Restart button;
// Game over result: player wins or AI wins;

var chess = document.getElementsByClassName('chess')[0];

var title = document.getElementsByClassName('title')[0];

var context = chess.getContext('2d');

context.strokeStyle = '#B9B9B9';

window.onload = function () {
    drawChessBoard();
}

// set chess board with 15 row & 15 cols
function drawChessBoard() {

    for (i = 0; i < 15; i++) {
        // set horizon line 
        //start position
        context.moveTo(15, 15 + i * 30);
        // end position
        context.lineTo(435, 15 + i * 30);
        //connect
        context.stroke();

        //set vertical line
        //start position
        context.moveTo(15 + i * 30, 15);
        // end position
        context.lineTo(15 + i * 30, 435);
        //connect
        context.stroke();
    }
}

//logic to win:
// any same color stone got a unbroken chain in horizonlly, vertically or diagonally. less or more than five does not result a win.
//rules: Black stone go frist; make turns; can't cancle;

// array for win
/*
X
0,0,0   0,0,1
1,0,0   1,1,1
2,0,0   2,2,1 
3,0,0   3,3,1 
4,0,0   4,4,1 ...
Y
1,0,1
2,0,1
3,0,1
4,0,1
5,0,1...
*/

var wins = [];
for (var i = 0; i < 15; i++) {
    wins[i] = [];
    for (var j = 0; j < 15; j++) {
        wins[i][j] = []
    }
}
// // win in Horizontally X 
var count = 0;
// for loop, the last position can make a 5 in row is x=11
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j + k][i][count] = true;   //[x+k]=y; i=x count =  # win array
        }
        count++;
    }
}

// // //win in Vertically Y

for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {  //11 point can set the stone
        for (var k = 0; k < 5; k++) {
            wins[i][j + k][count] = true;   //i=x [j+k]=y; 
        }
        count++;
    }
}

// //win in Diagonally Z
// option 1 '\\'style
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {  //11 point can set the stone
        for (var k = 0; k < 5; k++) {
            wins[i + k][j + k][count] = true;   // i=x [j+k]=y; 
        }
        count++;
        }
}

// option 2 '//'style x 0-11. y 4-14
for (var i = 0; i < 11; i++) {
    for (var j = 14; j > 3; j--) {  //11 point can set the stone
        for (var k = 0; k < 5; k++) {
            wins[i + k][j - k][count] = true;   // i=x [j+k]=y; 
        }
        count++;
    }
}


//2D to mark whether the spot has been placed with stone

var chessboard = [];
// vaild as drauft
for (var i = 0; i < 15; i++) {
    chessboard[i] = [];
    for (var j = 0; j < 15; j++) {
        chessboard[i][j] = 0;
    }
}

  // // create the stone
  function oneStep(i, j, me) {

    context.beginPath(); //draw circle start from

    context.arc(15 + i * 30, 15 + j * 30, 13, 0, 2 * Math.PI);  //draw circle

    context.closePath(); // draw circle end here

    var color;
    if (me) {
        color = 'black';
    } else {
        color = 'white';
    }
    context.fillStyle = color;
    context.fill();
}

//player

var me = true;
var over = false;

var playerWin = []; //init & store the score of wins option 
var computerWin = [];
for (var i = 0; i < count; i++) {
    playerWin[i] = 0;
    computerWin[i] = 0;
}

chess.onclick = function (e) {
    if (over) {
        return;
    }
    // modif if player can drop the stone
    if (!me) {
        return;
    }
    // coord X
    var x = e.offsetX;
    // coord Y
    var y = e.offsetY;;
    //space between each line is 30, make sure the stone place on the right position
    var i = Math.floor(x / 30);
    var j = Math.floor(y / 30);

    if (chessboard[i][j] == 0) {

        // placing a new stone
        oneStep(i, j, me);
        // mark the spot was occupied 
        chessboard[i][j] = 1;

        for (var k = 0; k < count; k++) {

            if (wins[i][j][k]) {

                playerWin[k]++;

                if (playerWin[k] == 5) {
                    // alert(k);
                    // alert('Your are the Winner!')
                    title.innerHTML = 'Your are the Winner!'

                    over = true;
                }
            }
        }
    }
    if (!over) {
        me = !me;
        //AI's turn
        computerAI()
    }
}

//AI

function computerAI() {
    // set the value of the stone placed on player's side;
    var playerScore = [];
    // set the value of the stone placed on AI's side
    var computerScore = [];
    
    for (var i = 0; i < 15; i++) {

        playerScore[i] = [];
        computerScore[i] = [];

        for (var j = 0; j < 15; j++) {

            playerScore[i][j] = 0;
            computerScore[i][j] = 0;
        }
    }

 //Strategy set the computer: 
    //  set the value of valid spot
    var max = 0;
    //  set the coord of the max value spot - valid spots
    var x = 0; y = 0;

    for (var i = 0; i < 15; i++) {

        for (var j = 0; j < 15; j++) {

            //if the spot is valid
            if (chessboard[i][j] == 0) {  //chessboard valid = 0, else = 1
                // k = option to win
                for (var k = 0; k < count; k++) {

                    if (wins[i][j][k]) {
                        //the stratege of AI place stone
                        if (playerWin[k] == 1) { //  value = 1, means 1 stone on the spot
                            playerScore[i][j] += 200;

                        } else if (playerWin[k] == 2) {   // value = 2, means 2 stone in line
                               playerScore[i][j] += 400;

                        } else if (playerWin[k] == 3) {
                               playerScore[i][j] += 800;

                        } else if (playerWin[k] == 4) {
                               playerScore[i][j] += 1000;
                        }

                        // the stratege of AI place stone
                        if(computerWin[k] == 1) {
                           computerScore[i][j] += 220;

                        } else if (computerWin[k] == 2) {
                             computerScore[i][j] += 420;

                        } else if (computerWin[k] == 3) {
                            computerScore[i][j] += 2200;

                        } else if (computerWin[k] == 4) {
                            computerScore[i][j] += 20000;
                          }
                        }
                    }  
                    //for rest of valid spots
                    if(playerScore[i][j] > max) {
                        max = playerScore[i][j];
                        x = i;
                        y = j;
                    } else if(playerScore[i][j] == max) {
                        if(computerScore[i][j] > max) {   // if player & AI both has 3 on line, AI will choose win frist instead of defense.
                        max = computerScore[i][j];
                        x = i;
                        y = j;
                        }
                    }

                    if(computerScore[i][j] > max) {
                        max = computerScore[i][j];
                        x = i;
                        y = j;
                    } else if(computerScore[i][j] == max) {
                        if(playerScore[i][j] > max) {
                            max = playerScore[i][j];
                            x = i;
                            y = j;
                        }
                    }
            }
        }
    }
//place stone
    oneStep(x, y, me);
    chessboard[x][y] = 1;

    for(var k = 0; k < count; k++) {
        if(wins[x][y][k]) {   //all the x/y option to win
            computerWin[k] += 1; // each stone placed + 1 point, till 5, mean 5 in line
            if(computerWin[k] == 5) {
                title.innerHTML='Computer Wins!'
                over = true;
            }
        }
    }
    if(!over) {
        me = !me;   //faulse
    }
    }

    function rst() {      // Restart button
    window.location.reload(); //refresh website
} 


