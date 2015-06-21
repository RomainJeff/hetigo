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
    console.log("case: "+ cellid);

    var indexTiret = cellid.split("_");
    var x = parseInt(indexTiret[0]);
    var y = parseInt(indexTiret[1]);
    
    if (game[x][y] != 0 || suicide(x,y) == true || ko(x,y) == true) {
        console.log("Impossible de jouer ici");
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
    
    for(var i = 0; i < numLibGroup.length; i++) {
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

function iamode () {

    actualisationGroups();

    
    function arrayEnemies () {
            // on crée un tableau qui stocke les num_group adverses
        var num_GRPADVS = [0];
        var lib_GRPADVS = [0];

        // on cherche sur le Goban tous les pions adverses 
        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Rows; j++) {
                if (game[i][j] == 1 && group[i][j] != undefined) {
                    // on cherche dans le tableau créé si le groupe du pion analysé est déjà stocké
                    var presence = false;
                    for (var k = 0; k <= num_GRPADVS.length; k++) {
                        if (num_GRPADVS[k] == group[i][j]) {
                            presence = true;
                        }
                    }
                    // s'il n'est pas stocké, on le stock haha
                    if (presence === false) {
                        num_GRPADVS.push(group[i][j]);
                        lib_GRPADVS.push(numLibGroup[group[i][j]]);
                    }
                }
            }
        }

        return [num_GRPADVS, lib_GRPADVS];

    }


    function enemiesLiberties () {
        var enemies = arrayEnemies();
        var enemyGroups = enemies[0];
        var enemyLibGroups = enemies[1];
        // il s'agit ici de compter les libertés de chaque groupe enemi et déterminer quel groupe a le moins de liberté
        var interest = 1000;
        var intgr;

        for (var i = 0; i < enemyGroups.length; i++) {
            if (i === 0) continue;

            if (enemyLibGroups[i] < interest) {
                interest = enemyLibGroups[i];
                intgr = enemyGroups[i];
            }       
        }

        //console.log("le groupe qui a le moins de liberté est: "+ intgr);

        return intgr;
    }
    
    /*
    * on récupère avec cette fonction les coordonées de chaque pion qui constitue le groupe adverse retourné par enemiesLiberties()
    * et on compte les pions de ce groupe  
    */
    function coordintgr () {

        var whichEnemy = enemiesLiberties();
        var nombrePions = 0;
        var coordIntgrPions = [];

        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Rows; j++) {
                if (group[i][j] == whichEnemy){
                    coordIntgrPions.push({x: i, y: j});
                    nombrePions++;
                }
            }
        }

        return [nombrePions, coordIntgrPions];

    }


    /*
    * Cette fonction analyse le groupe pour determiner les pions qui constituent ses bords
    */
    function extremiteIntGr () {
        var coord = coordintgr();
        var nmbPions = coord[0];
        var tabCoordPions = coord[1];

        var extPionsIntGr = [];

        for (var i = 0; i < tabCoordPions.length; i++) {

            console.log(game[(tabCoordPions[i].x)][tabCoordPions[i].y]);

            if (
                ( (tabCoordPions[i].x == 0 || game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] == 0 ) && 
                    (game[(tabCoordPions[i].x)+1][tabCoordPions[i].y] == 0 || game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] == 0 ||
                    game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] == 0)
                    ) ||
                ( (tabCoordPions[i].x == Rows-1 || game[(tabCoordPions[i].x)+1][tabCoordPions[i].y] == 0 ) &&
                    (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] == 0 || game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] == 0 ||
                    game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] == 0)
                    ) ||
                ( (tabCoordPions[i].y == 0 || game[(tabCoordPions[i].x)][tabCoordPions[i].y-1] == 0 ) &&
                    (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] == 0 || game[tabCoordPions[i].x+1][(tabCoordPions[i].y)] == 0 ||
                    game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] == 0)
                    ) ||
                ( (tabCoordPions[i].y == Rows-1 || game[(tabCoordPions[i].x)][tabCoordPions[i].y+1] == 0 ) &&
                    (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] == 0 || game[tabCoordPions[i].x+1][(tabCoordPions[i].y)] == 0 ||
                    game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] == 0)
                    )
                
                ) {
                //console.log(tabCoordPions[i]);

                extPionsIntGr.push(tabCoordPions[i]);

                //console.log(extPionsIntGr);
            }
        }

        return extPionsIntGr;
    }
    
    function play () {
        var tabExtPionsIntGr = extremiteIntGr();
        console.log(tabExtPionsIntGr);

        // on prend un chiffre au hasard entre 0 et le nombre total de pierre d'extrémité
        var whichOne = Math.floor(Math.random()* tabExtPionsIntGr.length);

        // on récupère les coordonnées du pion corresondant au numéro tiré
        var selectedStoneCoord = tabExtPionsIntGr[whichOne];

        console.log("lol:");
        console.log(tabExtPionsIntGr[whichOne]);

        var tabSelectedStoneCoord = [];

        // on determine quelles sont les coordonnées des libertés de ce pion et on stock les coordonnées du dans un tableau
        if (tabExtPionsIntGr[whichOne].x != Rows-1 && game[tabExtPionsIntGr[whichOne].x +1][tabExtPionsIntGr[whichOne].y] == 0) {
            tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x+1, y: tabExtPionsIntGr[whichOne].y});
        }

        if (tabExtPionsIntGr[whichOne].x != 0 && game[tabExtPionsIntGr[whichOne].x -1][tabExtPionsIntGr[whichOne].y] == 0) {
            tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x-1, y: tabExtPionsIntGr[whichOne].y});
        }

        if (tabExtPionsIntGr[whichOne].y != Rows-1 && game[tabExtPionsIntGr[whichOne].x][tabExtPionsIntGr[whichOne].y+1] == 0) {
            tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x, y: tabExtPionsIntGr[whichOne].y+1});
        }

        if (tabExtPionsIntGr[whichOne].y != 0 && game[tabExtPionsIntGr[whichOne].x][tabExtPionsIntGr[whichOne].y-1] == 0) {
            tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x, y: tabExtPionsIntGr[whichOne].y-1});
        }


        console.log(tabSelectedStoneCoord);

        // on joue sur une de ces coordonées au hasard en tirant un numéro aléatoire entre 0 et le nombre total de liberté
        var tabSelectedStoneLibCoord = Math.floor(Math.random()* tabSelectedStoneCoord.length);
        console.log(tabSelectedStoneCoord[tabSelectedStoneLibCoord]);

console.log(tabSelectedStoneCoord[tabSelectedStoneLibCoord].x);
console.log(tabSelectedStoneCoord[tabSelectedStoneLibCoord].y);

        return [tabSelectedStoneCoord[tabSelectedStoneLibCoord].x, tabSelectedStoneCoord[tabSelectedStoneLibCoord].y]

    }
 
    var newStone = play();
    var rand1 = newStone[0];
    var rand2 = newStone[1];

    var random = rand1+"_"+rand2;
  

    

    //var random = parseInt(Math.floor(Math.random() * (Rows-1))) +'_'+ parseInt(Math.floor(Math.random() * (Rows-1)));
    //var rand1 = Math.ceil(Math.random() * 2);
    //var rand2 = Math.ceil(Math.random() * 2);

    //var random = (tabCoordPions[0].i + rand1) +"_"+ (tabCoordPions[0].j + rand2);
    
    console.log('ia joue ici"'+ random +'"');
    //console.log("IA joue");

    toggle(random);

    tempPlayer = player;
    player = waitingPlayer;
    waitingPlayer = tempPlayer;

    //console.log("player2="+ player);
// fin dela fonction iamode
}


function playerTurn () {
    var tempPlayer = player;

    if (playerMode == 1) {
        player = waitingPlayer;
        waitingPlayer = tempPlayer;
    } else if (playerMode == 3) {
        if (player == 1) {
            tempPlayer = player;
            player = waitingPlayer;
            waitingPlayer = tempPlayer;

            //console.log("player1=" + player);

            setTimeout('iamode()', 300);
        }
    }

    skippedTurn = 0;
    document.getElementById("currentPlayer").innerHTML = "Current Player: "+ player;
}


function skipTurn (){
    skippedTurn++;
    turn++;

    var tempPlayer = player;
    player = waitingPlayer;
    waitingPlayer = tempPlayer;

    document.getElementById("currentPlayer").innerHTML = "Current Player: "+ player;

    if (skippedTurn == 2) {
        EndGame();
    }
}


function graphisme () {
    document.getElementById("currentPlayer").innerHTML = "Current Player: "+ player;
    document.getElementById("whitePrisoner").innerHTML = "Prisoners: "+ prisoner[2];
    document.getElementById("blackPrisoner").innerHTML = "Prisoners: "+ prisoner[1];

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
    window.alert("Fin de la partie ! Joueur noir à" + pointsPlayers[1] + "points et blanc" + pointsPlayers[2] + "points");
    
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
            } else if (game[i][j] == 2) {
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