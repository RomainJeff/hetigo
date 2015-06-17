var turn = 1; // Turn number

var prisoner = new Array();
prisoner[1] = 0; // Prisoners of player 1 (black)
prisoner[2] = 0; // Prisoners of player 2 (white)

var skippedTurn = 0;

//var player = 1; // 1 = black, 2 = white
//var waitingPlayer = 2;

var pointsPlayers = new Array() ; // points of each players: pointsPlayer[1]=black player & pointsPlayer[2]=white player

var group = new Array(); // Number of group/chain of each cell
for (var i = 0; i < Rows; i++) {
    group[i] = new Array ();
}

var numLibGroup = new Array();

var game = new Array(); // Game state
for (var i = 0; i < Rows; i++) {
    game[i] = new Array ();
    
    for (var j = 0; j < Rows; j++) {
        game[i][j] = new Array();
        game[i][j] = 0;
    }
}
     
var saveTurn = new Array (9); // Save of the last 10 turn

if (handicap != 0) {
    handicapSetUp();
}

graphisme();