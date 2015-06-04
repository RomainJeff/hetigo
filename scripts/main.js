var turn = 1; // Turn number

var prisoner = new Array();
prisoner[1]=0; // Prisoners of player 1 (black)
prisoner[2]=0; // Prisoners of player 2 (white)

var skippedTurn = 0;

//var player = 1; // 1 = black, 2 = white
//var waitingPlayer = 2;

var pointsPlayers = new Array() ; // points of each players: pointsPlayer[1]=black player & pointsPlayer[2]=white player

var group = new Array(); // Number of group/chain of each cell
for (var i=0; i<Rows; i++) {
    group[i] = new Array ();
}


var game = new Array(); // Game state
for (var i=0; i<Rows; i++) {
    game[i] = new Array ();
    
    for (var j=0; j<Rows; j++) {
        game[i][j] = new Array();
        game[i][j] = 0;
    }
}
     
var saveTurn = new Array (9); // Save of the last 10 turn


if (handicap!=0) {
    handicapSetUp();
}

function handicapSetUp() {
    game[3][3]=1;
    game[3][15]=1;
    game[9][9]=1;
    game[15][15]=1;
    game[15][3]=1;
    if (handicap==9) {
        game[9][3]=1;
        game[3][9]=1;
        game[9][15]=1;
        game[15][9]=1;
    }
    playerTurn();
}

graphisme();

function toggle(cellid) {
    
    console.log("case: " + cellid);
    var indexTiret = cellid.indexOf("_");
    var x = parseInt(cellid.substring(0, indexTiret));
    var y = parseInt(cellid.substring(indexTiret+1));
    
    if (game[x][y]!=0 || suicide(x,y)==true || ko(x,y)==true) {
        console.log("Impossible de jouer ici");
        // return;
    } else {
        game[x][y]=player;
        saveTurn[turn%10]= x+"_"+y+"_"+player;
        
        actualisationGroups();
        capture(x,y);
        turn++;
        playerTurn();
        graphisme();
    }
}



function suicide (x,y) {
    
    game[x][y]=player;
    
    // OPTIMISER CETTE MERDE !!!!!!!! (Mais ca marche)
    var suicide = true;
    actualisationGroups();
    var groupeNum = group[x][y];
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (group[i][j]==groupeNum && groupeNum!=0) {
                if ( ((j-1)>=0 && game[i][j-1]==0)  || ((i+1)<Rows && game[i+1][j]==0) || ((j+1)<Rows && game[i][j+1]==0) || ((i-1)>=0 && game[i-1][j]==0) ) {
                    suicide = false;
                }
            }
        }
    }
    
    if (suicide==true) {
        if ( (y-1)>=0 && game[x][y-1]==waitingPlayer && libertiesGroup(x, y-1)==false) {
            game[x][y] = 0;
            return false;
        } else if ((x+1)<Rows && game[x+1][y]==waitingPlayer && libertiesGroup(x+1, y)==false) {
            game[x][y] = 0;
            return false;
        } else if ((y+1)<Rows && game[x][y+1]==waitingPlayer && libertiesGroup(x, y+1)==false) {
            game[x][y] = 0;
            return false;
        } else if ((x-1)>=0 && game[x-1][y]==waitingPlayer && libertiesGroup(x-1, y)==false) {
            game[x][y] = 0;
            return false;
        } else {
            game[x][y] = 0;
            console.log("suicide");
            return true;
        }
    }
}



function ko (x,y)
{
    saveTurn[turn%10]= x+"_"+y+"_"+player;
    if (turn>2 && saveTurn[(turn-2)%10]==saveTurn[turn%10]) {
        saveTurn[turn%10]=0;
        console.log("ko");
        return true;
    } else {
        saveTurn[turn%10]=0;
        return false;
    }
}



function capture (x,y) {
    
    if ( (y-1)>=0 && game[x][y-1]==waitingPlayer) {
       if (libertiesGroup(x, y-1)==false) {
           supGroup(x, y-1);
        }
    }
    if ((x+1)<Rows && game[x+1][y]==waitingPlayer) {
        if (libertiesGroup(x+1, y)==false) {
           supGroup(x+1, y);
        }
    }
    if ((y+1)<Rows && game[x][y+1]==waitingPlayer) {
        if (libertiesGroup(x, y+1)==false) {
           supGroup(x, y+1);
        }
    }
    if ((x-1)>=0 && game[x-1][y]==waitingPlayer) {
        if (libertiesGroup(x-1, y)==false) {
           supGroup(x-1, y);
        }
    }
}




function actualisationGroups () {
    
    var num_Group = 1;
    
    for (i=0; i<Rows; i++) {
        for (j=0; j<Rows; j++) {
            group[i][j]=undefined;
        }
    }
    
    for (i=0; i<Rows; i++) {
        for (j=0; j<Rows; j++) {
            if ( game[i][j]==0) {
                group[i][j]=0;
            } else if (group[i][j]===undefined) {
                groupRecursive(i,j);
                num_Group++;
            }
        }
    }
    
    function groupRecursive (x,y) {
        group[x][y]=num_Group;
        if ( (y-1)>=0 && game[x][y] == game[x][y-1] && group[x][y-1]===undefined) {
            groupRecursive(x, (y-1));
        }
        if ( (x+1)<Rows && game[x][y] == game[x+1][y] && group[x+1][y]===undefined) {
            groupRecursive((x+1), y);
        }
        if ( (y+1)<Rows && game[x][y] == game[x][y+1] && group[x][y+1]===undefined) {
            groupRecursive(x, (y+1));
        }
        if ( (x-1)>=0 && game[x][y] == game[x-1][y] && group[x-1][y]===undefined) {
            groupRecursive((x-1), y);
        }
        return;
    }
}




function libertiesGroup (x,y) {// Seeking the liberties of a group
    actualisationGroups();
    var groupNum = group[x][y];
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (group[i][j]==groupNum && groupNum!=0) {
                if ( ((j-1)>=0 && game[i][j-1]==0)  || ((i+1)<Rows && game[i+1][j]==0) || ((j+1)<Rows && game[i][j+1]==0) || ((i-1)>=0 && game[i-1][j]==0) ) {
                    return true; // This group has at least one liberty
                }
            }
        }
    }
    return false; // The group has not liberties left
}




function supGroup (x,y) // Deleting the groups
{
    var groupNum = group[x][y]; // The group of this cell has no liberties left, it has to be deleted
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (group[i][j]==groupNum) {
                game[i][j] = 0; // Every cell of this group is now empty
                if (player==1) {
                    prisoner[1]++;
                } else {
                    prisoner[2]++;
                }
                
            }
        }
    }
}

function iamode() {

    var random = parseInt(Math.floor(Math.random() *18))+'_'+parseInt(Math.floor(Math.random() *18));
    
    console.log('"'+random+'"');

    console.log("IA joue");
    toggle(random);
    tempPlayer = player;
    player = waitingPlayer;
    waitingPlayer = tempPlayer;
    console.log("player2=" + player);
}

function playerTurn () {

    var tempPlayer = player;

    if (playerMode == 1){
 
    player = waitingPlayer;
    waitingPlayer = tempPlayer;
}
else if (playerMode == 3){
    if (player == 1){
       

        tempPlayer = player;
        player = waitingPlayer;
        waitingPlayer = tempPlayer;
        console.log("player1=" + player);
        setTimeout('iamode()',300);
        
    }
    
    skippedTurn=0;
    document.getElementById("currentPlayer").innerHTML="Current Player: "+ player;
}
}

function skipTurn (){
    skippedTurn++;
    turn++;
    var tempPlayer = player;
    player=waitingPlayer;

    waitingPlayer= tempPlayer;
    document.getElementById("currentPlayer").innerHTML="Current Player: "+ player;
    if (skippedTurn==2) {
        EndGame();
    }
     }



function graphisme () {
    document.getElementById("currentPlayer").innerHTML="Current Player: "+ player;
    document.getElementById("whitePrisoner").innerHTML="Prisoners: "+ prisoner[2];
    document.getElementById("blackPrisoner").innerHTML="Prisoners: "+ prisoner[1];
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (game[i][j]==0) {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "empty");
            } 
            if (game[i][j]==1)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "black");
            }
            else if (game[i][j]==2)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "white");
            }   
        }
    }
}

function EndGame() {
    countPoints();
    window.alert("Fin de la partie ! Joueur noir à " + pointsPlayers[1] + "points et blanc " + pointsPlayers[2] + "points");
    
    /*
    document.innerHTML="";
    document.innerHTML="Partie terminée";
    document.innerHTML="Les points ... ";
    document.innerHTML="<div onclick='restart()'> REJOUER </div>";
    document.innerHTML="<div onclick='reset'> Retour au menu </div>";
    */
    // Empecher de jouer 
    // Compter les points
}

function countPoints () {
    pointsPlayers[1] = 0;
    pointsPlayers[2] = 5.5; // Black player has an advantage as the first player to play, so the white play has 5.5 points already
    if (handicap != 0) {
        pointsPlayers[2] = parseInt(handicap);
    }
    // Count the number of pawn of each player
    for (var i = 0; i<Rows; i++) {
        for (var j = 0; j<Rows; j++) {
            if (game[i][j]==1) {
                pointsPlayers[1]++;
            } else if (game[i][j]==2) {
                pointsPlayers[2]++;
            }
        }
    }
    
    // Count the territories of each player
    
}

function restart() {
    // Restart the game with the same parameters
    window.location.reload();
}

function reset() {
    // Back to the menu
    window.location.href = "index.html";
}


function saveGame() {
    console.log("save");
    var game_save = JSON.stringify(game);
    var saveTurn_save = JSON.stringify(saveTurn);
    var turn_save = JSON.stringify(turn);
    var player_save = JSON.stringify(player);
    var waitingPlayer_save = JSON.stringify(waitingPlayer);
    var prisoner_save = JSON.stringify(prisoner);
    var skippedTurn_save = JSON.stringify(skippedTurn);
    localStorage.setItem('game_save', game_save);
    localStorage.setItem('saveTurn_save', saveTurn_save);
    localStorage.setItem('turn_save', turn_save);
    localStorage.setItem('player_save', player_save);
    localStorage.setItem('waitingPlayer_save', waitingPlayer_save);
    localStorage.setItem('prisoner_save', prisoner_save);
    localStorage.setItem('skippedTurn_save', skippedTurn_save);
}

function reload() {
    console.log("reload");
    if (localStorage.getItem('game_save') == null) {
        window.alert("Aucun état de jeu sauvegardé !");
    } else {
        game = JSON.parse(localStorage.getItem('game_save'));
        saveTurn = JSON.parse(localStorage.getItem('saveTurn_save'));
        turn = JSON.parse(localStorage.getItem('turn_save'));
        prisoner = JSON.parse(localStorage.getItem('prisoner_save'));
        player = JSON.parse(localStorage.getItem('player_save'));
        waitingPlayer = JSON.parse(localStorage.getItem('waitingPlayer_save'));
        skippedTurn = JSON.parse(localStorage.getItem('skippedTurn_save'));
        graphisme();
    }
}