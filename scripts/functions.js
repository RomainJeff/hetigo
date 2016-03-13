/**
 * Place les handicaps sur la grille
 */
function handicapSetUp () {
    game[3][3] = 1;
    game[3][15] = 1;
    game[9][9] = 1;
    game[15][15] = 1;
    game[15][3] = 1;

    if (handicap == 9) {
        game[9][3] = 1;
        game[3][9] = 1;
        game[9][15] = 1;
        game[15][9] = 1;
    }

    playerTurn();
}

/**
 * Place une pierre du joueur courant sur la grille
 * @param string cellid
 */
function toggle (cellid) {
    if (player == 1){
        console.log("je joue ici "+ cellid);
    }
    

    var indexTiret = cellid.split("_");
    var x = parseInt(indexTiret[0]);
    var y = parseInt(indexTiret[1]);
    
    if (game[x][y] != 0 || suicide(x,y) == true || ko(x,y) == true) {
        console.log("Impossible de jouer ici");
        if (game[x][y]!=0 && playerMode!=3){
            document.querySelector('.pions').classList.remove('invisible');
            document.querySelector('.pions').classList.add('visible');
            setTimeout(function(){
                document.querySelector('.pions').classList.add('invisible');
                document.querySelector('.pions').classList.remove('visible');
            }, 2000);
        }
        // return;
    } else {
        game[x][y] = player;
        saveTurn[turn % 10] = x +"_"+ y +"_"+ player;
        
        actualisationGroups();
        capture(x,y);

        turn++;

        playerTurn();
        graphisme();
    }
}


/**
 * Verifie si le coup actuel n'est pas un suicide
 * @param int x
 * @param int y
 */
function suicide (x, y) {
    game[x][y] = player;
    
    // OPTIMISER CETTE MERDE !!!!!!!! (Mais ca marche)
    var suicide = true;
    actualisationGroups();
    var groupeNum = group[x][y];
    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Rows; j++) {
            if (group[i][j] == groupeNum && groupeNum != 0) {
                if ( ((j-1) >= 0 && game[i][j-1] == 0)  || ((i+1) < Rows && game[i+1][j] == 0) || ((j+1) < Rows && game[i][j+1] == 0) || ((i-1) >= 0 && game[i-1][j] == 0) ) {
                    suicide = false;
                }
            }
        }
    }
    
    if (suicide == true) {
        if ( (y-1) >= 0 && game[x][y-1] == waitingPlayer && numLibGroup[(group[x][y-1])] == 0) {
            game[x][y] = 0;
            return false;
        } else if ((x+1) < Rows && game[x+1][y] == waitingPlayer && numLibGroup[(group[x+1][y])] == 0) {
            game[x][y] = 0;
            return false;
        } else if ((y+1) < Rows && game[x][y+1] == waitingPlayer && numLibGroup[(group[x][y+1])] == 0) {
            game[x][y] = 0;
            return false;
        } else if ((x-1) >= 0 && game[x-1][y] == waitingPlayer && numLibGroup[(group[x-1][y])] == 0) {
            game[x][y] = 0;
            return false;
        } else {
            game[x][y] = 0;
            console.log("suicide");
            if (playerMode != 3){
                document.querySelector('.suicide').classList.remove('invisible');
                document.querySelector('.suicide').classList.add('visible');
                setTimeout(function(){
                    document.querySelector('.suicide').classList.add('invisible');
                    document.querySelector('.suicide').classList.remove('visible');
                }, 2000);
            }
            return true;
        }
    }
}


/**
 * Verifie que le joueur ne rejoue pas le coup precedent ou il a perdu sa pierre
 * @param int x
 * @param int y
 * @return boolean
 */
function ko (x, y) {
    saveTurn[turn % 10] = x +"_"+ y +"_"+ player;
    if (turn > 2 && saveTurn[(turn-2) % 10] == saveTurn[turn % 10]) {
        saveTurn[turn % 10] = 0;
        console.log("ko");
        if (playerMode != 3){
            document.querySelector('.ko').classList.remove('invisible');
            document.querySelector('.ko').classList.add('visible');
            setTimeout(function(){
                document.querySelector('.ko').classList.add('invisible');
                document.querySelector('.ko').classList.remove('visible');
            }, 2000);
        }
        return true;
    } else {
        saveTurn[turn % 10] = 0;
        return false;
    }
}


function capture (x, y) {
    if ( (y-1) >= 0 && game[x][y-1] == waitingPlayer && numLibGroup[(group[x][y-1])] == 0) {
        supGroup(x, y-1);
    }
    if ((x+1) < Rows && game[x+1][y] == waitingPlayer && numLibGroup[(group[x+1][y])] == 0) {
        supGroup(x+1, y);
    }
    if ((y+1) < Rows && game[x][y+1] == waitingPlayer && numLibGroup[(group[x][y+1])] == 0) {
        supGroup(x, y+1);
    }
    if ((x-1) >= 0 && game[x-1][y] == waitingPlayer && numLibGroup[(group[x-1][y])] == 0) {
        supGroup(x-1, y);
    }
    
}


function actualisationGroups () {
    
    var num_Group = 1;

    

    for (i = 0; i < Rows; i++) {
        for (j = 0; j < Rows; j++) {
            group[i][j] = undefined;
        }
    }
    
    for(var i =0; i< numLibGroup.length; i++) {
        numLibGroup[i] = 0;
    }
    
    for (i = 0; i < Rows; i++) {
        for (j = 0; j < Rows; j++) {
            if (countPointsFunction == true ) { // When counting the points, creates groups of empty cells for territories
                if ( game[i][j] != 0) {
                    group[i][j] = 0;
                } else if (group[i][j] === undefined) {
                    groupRecursive(i,j);
                    num_Group++;
                }
            } else { // Else, during the game, creates groups of cells of each player
                if ( game[i][j] == 0) {
                    group[i][j] = 0;
                } else if (group[i][j] === undefined) {
                    groupRecursive(i,j);
                    num_Group++;
                }
            }
        }
    }
    

    function groupRecursive (x, y) {
        group[x][y] = num_Group;
        
        if (countPointsFunction == false ) { // Count the liberties only when creating cells groups
            numLibGroup[num_Group] = numLibGroup[num_Group] + libertiesCell(x,y);
        } else {
            territoriesNeighboors(x,y);
        }
        

        if ( (y-1) >= 0 && game[x][y] == game[x][y-1] && group[x][y-1] === undefined) {
            groupRecursive(x, (y-1));
        }
        if ( (x+1) < Rows && game[x][y] == game[x+1][y] && group[x+1][y] === undefined) {
            groupRecursive((x+1), y);
        }
        if ( (y+1) < Rows && game[x][y] == game[x][y+1] && group[x][y+1] === undefined) {
            groupRecursive(x, (y+1));
        }
        if ( (x-1) >= 0 && game[x][y] == game[x-1][y] && group[x-1][y] === undefined) {
            groupRecursive((x-1), y);
        }
        return;
    }

    function libertiesCell (x, y) {
        var nbLiberties = 0;
        if ((y-1) >= 0 && game[x][y-1] == 0) {
            nbLiberties ++;
        }
        if ((x+1) < Rows && game[x+1][y] == 0) {
            nbLiberties ++;
        }
        if ((y+1) < Rows && game[x][y+1] == 0) {
            nbLiberties ++;
        }
        if ((x-1) >= 0 && game[x-1][y] == 0) {
            nbLiberties ++;
        }
        return nbLiberties;
    }

    function territoriesNeighboors (x, y) {
        if ((y-1) >= 0 && game[x][y-1] != 0) {
            if (territories[num_Group] === undefined) {
                territories[num_Group] = game[x][y-1];
            } else if (territories[num_Group] != game[x][y-1]) {
                territories[num_Group] = 3;
            }
        }
        if ((x+1) < Rows && game[x+1][y] != 0) {
            if (territories[num_Group] === undefined) {
                territories[num_Group] = game[x+1][y];
            } else if (territories[num_Group] != game[x+1][y]) {
                territories[num_Group] = 3;
            }
        }
        if ((y+1) < Rows && game[x][y+1] != 0) {
            if (territories[num_Group] === undefined) {
                territories[num_Group] = game[x][y+1];
            } else if (territories[num_Group] != game[x][y+1]) {
                territories[num_Group] = 3;
            }
        }
        if ((x-1) >= 0 && game[x-1][y] != 0) {
           if (territories[num_Group] === undefined) {
                territories[num_Group] = game[x-1][y];
            } else if (territories[num_Group] != game[x-1][y]) {
                territories[num_Group] = 3;
            }
        }
    } 
    
    if (countPointsFunction==false) {
        for (var i=0; i<numLibGroup.length; i++) {
            numLibGroup[i]=fixLiberties(i);
        }
        
    }
    
    function fixLiberties (groupNb) {
        
        for (var i =0; i< Rows; i++) {
            for (var j=0; j<Rows; j++) {
                if (group[i][j]==groupNb) {
                    if ( (j-1) >= 0 && (i-1) >= 0 && group[i - 1][j]==groupNb && group[i - 1][j - 1]==groupNb && game[i][j-1]==0) { numLibGroup[groupNb]--; };
                    if ( (i-1) >= 0 && (j+1) < Rows && group[i - 1][j]==groupNb && group[i - 1][j + 1]==groupNb && game[i][j+1]==0) { numLibGroup[groupNb]--; };
                    if ( (j-1) >= 0 && (i+1) < Rows && group[i + 1][j]==groupNb && group[i + 1][j - 1]==groupNb && game[i][j-1]==0) { numLibGroup[groupNb]--; };
                    if ( (j+1) < Rows && (i+1) < Rows && group[i + 1][j]==groupNb && group[i + 1][j + 1]==groupNb && game[i][j+1]==0) { numLibGroup[groupNb]--; };
                }
            }
        }
        
        // Correct a bug when a liberty is surrounded by 4 pawn of a group
        for (var i =0; i< Rows; i++) {
            for (var j=0; j<Rows; j++) {
                if (game[i][j]==0) {
                    if ( ((i-1)>=0 && group[i-1][j]==groupNb) && ((j+1)<Rows && group[i][j+1]==groupNb) && ((i+1)<Rows && group[i+1][j]==groupNb) && ((j-1)>=0 && group[i][j-1]==groupNb) ){
                        numLibGroup[groupNb]++;
                    }
                }
            }
        }
        
        return numLibGroup[groupNb];
    }
    
}


function supGroup (x, y) { // Deleting the groups
    var groupNum = group[x][y]; // The group of this cell has no liberties left, it has to be deleted
    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Rows; j++) {
            if (group[i][j] == groupNum) {
                game[i][j] = 0; // Every cell of this group is now empty
                if (player == 1) {
                    prisoner[1]++;
                } else {
                    prisoner[2]++;
                }
                
            }
        }
    }
}


function playerTurn () {

    var tempPlayer = player;

    if (playerMode == 1){
 
    if (player==2){

        $("#talice").css("zIndex", 9999999999).addClass("animated fadeIn").delay(1000).queue(function(){
        $(this).addClass("animated fadeOut").dequeue();
      $(this).removeClass("animated fadeIn");
      $(this).removeClass("animated fadeOut");
      $(this).css("zIndex", 0);
});


    }
    else if(player==1) {
            $("#tplague").css("zIndex", 9999999999).addClass("animated fadeIn").delay(1000).queue(function(){
    $(this).addClass("animated fadeOut").dequeue();
    $(this).removeClass("animated fadeIn");
    $(this).removeClass("animated fadeOut");
    $(this).css("zIndex", 0);
});
    }
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
    console.log("passer");

    var tempPlayer = player;
    player = waitingPlayer;
    waitingPlayer = tempPlayer;

    if (player == 1)
        document.getElementById("currentPlayer").innerHTML = "<img class='alice' src='img/Talice.png'>";
    else
        document.getElementById("currentPlayer").innerHTML = "<img class='plague' src='img/Tplague.png'>";

    if (skippedTurn == 2) {
        EndGame();
    }
}


function graphisme () {
    if (player == 1)
        document.getElementById("currentPlayer").innerHTML = "<img class='alice' src='img/Talice.png'>";
    else
        document.getElementById("currentPlayer").innerHTML = "<img class='plague' src='img/Tplague.png'>";
    document.getElementById("whitePrisoner").innerHTML = prisoner[2];
    document.getElementById("blackPrisoner").innerHTML = prisoner[1];


    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Rows; j++) {
            var element = document.getElementById(i +"_"+ j);
            var classe = "empty";
            
            if (game[i][j] == 1) {
                classe = "black";
            } else if (game[i][j] == 2) {
                classe = "white";
            }

            element.setAttribute("class", classe);   
        }
    }
}


function EndGame () {
    countPoints();
    if (pointsPlayers[1]>pointsPlayers[2]) {
       document.getElementById("currentPlayer").innerHTML = "Alice gagne ! " + pointsPlayers[1] + " à " + pointsPlayers[2];
    } else if (pointsPlayers[1]<pointsPlayers[2]) {
        document.getElementById("currentPlayer").innerHTML = "Plague gagne ! " + pointsPlayers[2] + " à " + pointsPlayers[1];
    } else {
        document.getElementById("currentPlayer").innerHTML = "Egalité ! " + pointsPlayers[1] + " points";
    }
   
    
}


function countPoints () {
    pointsPlayers[1] = 0;
    pointsPlayers[2] = 5.5; // Black player has an advantage as the first player to play, so the white play has 5.5 points already
    if (handicap != 0) {
        pointsPlayers[2] = parseInt(handicap);
    }
    // Count the number of pawn of each player

    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Rows; j++) {
            if (game[i][j] == 1) {
                pointsPlayers[1]++;
            } else if (game[i][j]==2) {
                pointsPlayers[2]++;
            }
        }
    }
    
    // Count the territories of each player
    countPointsFunction = true;
    actualisationGroups();
    countPointsFunction = false;

    for (var i = 0; i<territories.length; i++) {
        if (territories[i] == 1) {
            for (var k = 0; k < Rows; k++) {
                for (var l = 0; l < Rows; l++) {
                    if (group[k][l] == i) {
                        pointsPlayers[1]++;
                        var element = document.getElementById(k+"_"+l);
                        element.setAttribute("class", "territory_black");
                    }
                }
            }
        }
        if (territories[i] == 2) {
            for (var k = 0; k < Rows; k++) {
                for (var l=0; l < Rows; l++) {
                    if (group[k][l] == i) {
                        pointsPlayers[2]++;
                        var element = document.getElementById(k+"_"+l);
                        element.setAttribute("class", "territory_white");
                    }
                }
            }
        }
    }
}


/**
 * Restart the game with the same parameters
 */
function restart () {
    window.location.reload();
}


/**
 * Back to the menu
 */
function reset () {
    window.location.href = "index.html";
}


function saveGame () {
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


function reload () {
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