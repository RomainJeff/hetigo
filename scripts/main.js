var tour = 1;

var prisoner1 = 0; // Prisoners of player 1 (black)
var prisoner2 = 0; // Prisoners of player 2 (white) 

var skippedTurn = 0;

var player = 2; // 1 = black, 2 = white
var waitingPlayer = 1;
playerTurn();

var group = new Array();
for (var i=0; i<Rows; i++) {
    group[i] = new Array ();
}



var game = new Array(); 
for (var i=0; i<Rows; i++) {
    game[i] = new Array ();
    
    for (var j=0; j<Rows; j++) {
        game[i][j] = new Array();
        game[i][j][0] = 2;
        game[i][j][0] = 0;
        
        for (var k=0; k<10; k++) {
            game[i][j][k] = 0;
        }
    }
}
     


function toggle(cellid) {
    
    console.log("case: " + cellid);
    var indexTiret = cellid.indexOf("_");
    var x = parseInt(cellid.substring(0, indexTiret));
    var y = parseInt(cellid.substring(indexTiret+1));
    
    if (game[x][y][0]!=0 || suicide(x,y)==true || ko(x,y)==true) {
        console.log("Impossible de jouer ici");
        // return;
    } else {
        game[x][y][0]=player;
        game[x][y][tour%10+1]=player;
        
        actualisationGroups();
        capture(x,y);
        graphisme();
        tour++;
        playerTurn();
    }
}



function suicide (x,y) {
    
    game[x][y][0]=player;
    
    // OPTIMISER CETTE MERDE !!!!!!!! (Mais ca marche)
    var suicide = true;
    actualisationGroups();
    var groupeNum = group[x][y];
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (group[i][j]==groupeNum && groupeNum!=0) {
                if ( ((j-1)>=0 && game[i][j-1][0]==0)  || ((i+1)<Rows && game[i+1][j][0]==0) || ((j+1)<Rows && game[i][j+1][0]==0) || ((i-1)>=0 && game[i-1][j][0]==0) ) {
                    suicide = false;
                }
            }
        }
    }
    
    if (suicide==true) {
        if ( (y-1)>=0 && game[x][y-1][0]==waitingPlayer && libertiesGroup(x, y-1)==false) {
            game[x][y][0] = 0;
            return false;
        } else if ((x+1)<Rows && game[x+1][y][0]==waitingPlayer && libertiesGroup(x+1, y)==false) {
            game[x][y][0] = 0;
            return false;
        } else if ((y+1)<Rows && game[x][y+1][0]==waitingPlayer && libertiesGroup(x, y+1)==false) {
            game[x][y][0] = 0;
            return false;
        } else if ((x-1)>=0 && game[x-1][y][0]==waitingPlayer && libertiesGroup(x-1, y)==false) {
            game[x][y][0] = 0;
            return false;
        } else {
            game[x][y][0] = 0;
            console.log("suicide");
            return true;
        }
    }
}



function ko (x,y)
{
    game[x][y][tour%10+1]=player;
    if (tour>2 && game[x][y][(tour-2)%10+1]!=0 && game[x][y][(tour-2)%10+1]==game[x][y][tour%10+1]) {
        game[x][y][tour%10+1]=0;
        console.log("ko");
        return true;
    } else {
        game[x][y][tour%10+1]=0;
        return false;
    }
}



function capture (x,y) {
    
    if ( (y-1)>=0 && game[x][y-1][0]==waitingPlayer) {
       if (libertiesGroup(x, y-1)==false) {
           supGroup(x, y-1);
        }
    }
    if ((x+1)<Rows && game[x+1][y][0]==waitingPlayer) {
        if (libertiesGroup(x+1, y)==false) {
           supGroup(x+1, y);
        }
    }
    if ((y+1)<Rows && game[x][y+1][0]==waitingPlayer) {
        if (libertiesGroup(x, y+1)==false) {
           supGroup(x, y+1);
        }
    }
    if ((x-1)>=0 && game[x-1][y][0]==waitingPlayer) {
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
            if ( game[i][j][0]==0) {
                group[i][j]=0;
            } else if (group[i][j]===undefined) {
                groupRecursive(i,j);
                num_Group++;
            }
        }
    }
    
    function groupRecursive (x,y) {
        group[x][y]=num_Group;
        if ( (y-1)>=0 && game[x][y][0] == game[x][y-1][0] && group[x][y-1]===undefined) {
            groupRecursive(x, (y-1));
        }
        if ( (x+1)<Rows && game[x][y][0] == game[x+1][y][0] && group[x+1][y]===undefined) {
            groupRecursive((x+1), y);
        }
        if ( (y+1)<Rows && game[x][y][0] == game[x][y+1][0] && group[x][y+1]===undefined) {
            groupRecursive(x, (y+1));
        }
        if ( (x-1)>=0 && game[x][y][0] == game[x-1][y][0] && group[x-1][y]===undefined) {
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
                if ( ((j-1)>=0 && game[i][j-1][0]==0)  || ((i+1)<Rows && game[i+1][j][0]==0) || ((j+1)<Rows && game[i][j+1][0]==0) || ((i-1)>=0 && game[i-1][j][0]==0) ) {
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
                game[i][j][0] = 0; // Every cell of this group is now empty
                if (player==1) {
                    prisoner1++;
                } else {
                    prisoner2++;
                }
                
            }
        }
    }
}

function playerTurn () {
    var tempPlayer = player;
    player=waitingPlayer;
    waitingPlayer= tempPlayer;
    
    skippedTurn=0;
    document.getElementById("currentPlayer").innerHTML="Current Player: "+ player;
    document.getElementById("whitePrisoner").innerHTML="Prisoners: "+ prisoner2;
    document.getElementById("blackPrisoner").innerHTML="Prisoners: "+ prisoner1;
}

function skipTurn (){
    skippedTurn++;
    var tempPlayer = player;
    player=waitingPlayer;
    waitingPlayer= tempPlayer;
    document.getElementById("currentPlayer").innerHTML="Current Player: "+ player;
    if (skippedTurn==2) {
        EndGame();
    }
}


function graphisme () {
    for (var i=0; i<Rows; i++) {
        for (var j=0; j<Rows; j++) {
            if (game[i][j][0]==0) {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "empty");
            } 
            if (game[i][j][0]==1)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "black");
            }
            else if (game[i][j][0]==2)
            {
                var element = document.getElementById(i+"_"+j);
                element.setAttribute("class", "white");
            }   
        }
    }
}

function EndGame() {
    console.log("fin de partie");
    
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

function restart() {
    // RECOMMENCER
    
}

function reset() {
    // Retour au menu
}