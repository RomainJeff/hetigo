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


/*
* il s'agit ici de compter les libertés de chaque groupe enemi et déterminer quel groupe a le moins de liberté
*/
function enemiesLiberties () {
    var enemies = arrayEnemies();
    var enemyGroups = enemies[0];
    var enemyLibGroups = enemies[1];
    
    var interest = 1000;
    var intLib;
    var sameLib = [];


    // on cherche avec cette boucle le groupe qui a le moins de liberté
    for (var i = 0; i < enemyGroups.length; i++) {
        if (i === 0) continue;

        if (enemyLibGroups[i] < interest) {
            interest = enemyLibGroups[i];
            intLib = enemyGroups[i];
        }
    }


    var nombrePions = 0;
    // on cherche avec cette boucle tous les groupes qui ont le même nombre de liberté que le groupe ayant le nombre de liberté minimal
    // et on stock tous ces groupes dans le tableau sameLib. 
    for (var i = 0; i < enemyGroups.length; i++) {
        if (i === 0) continue;

        if (interest == enemyLibGroups[i]) {
            sameLib.push({num: enemyGroups[i], pions: nombrePions});
        }
    }
    


    //on compte le nombre de pions qui composent chacun des groupes du tableau sameLib 
    
    for (var k = 0; k < sameLib.length; k++){
        var nombrePions = 0;

        for (var i = 0; i < Rows; i++) {
            for (var j = 0; j < Rows; j++) {
                if (group[i][j] == sameLib[k].num) {
                    nombrePions++;                            
                } 
            }

            sameLib[k].pions = nombrePions;
        }

    }

    var plusPions = 0;
    var intgr;

    // on cherche dans le tableau sameLib le groupe qui a le plus de pions
    for (var i = 0; i < sameLib.length; i++) {
        if (sameLib[i].pions > plusPions) {
            plusPions = sameLib[i].pions;
            intgr = sameLib[i].num;

            //console.log(intgr);
        }

    }

    //console.log("le groupe qui a le moins de liberté et le plus de pions est: "+ intgr);

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

    //console.log('hey');
    //console.log(whichEnemy);

    for (var i = 0; i < Rows; i++) {
        for (var j = 0; j < Rows; j++) {
            if (group[i][j] == whichEnemy){
                coordIntgrPions.push({x: i, y: j});

            }
        }
    }

    // console.log('coordonées des pions de intgr');
    // console.log(coordIntgrPions);

    return coordIntgrPions;

}


/*
* Cette fonction analyse le groupe pour determiner les pions qui constituent ses bords
*/
function extremiteIntGr () {
    var tabCoordPions = coordintgr();

    var extPionsIntGr = [];

    for (var i = 0; i < tabCoordPions.length ; i++) {
        //console.log(tabCoordPions.length);

        //console.log(game[(tabCoordPions[i].x)][tabCoordPions[i].y]);

        if (
            ( (tabCoordPions[i].x == 0 || game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] == 0 ) && 
                (game[(tabCoordPions[i].x)+1][tabCoordPions[i].y] != 1 || game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] != 1 ||
                game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] != 1)
                ) ||
            ( (tabCoordPions[i].x == Rows-1 || game[(tabCoordPions[i].x)+1][tabCoordPions[i].y] == 0 ) &&
                (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] != 1 || game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] != 1 ||
                game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] != 1)
                ) ||
            ( (tabCoordPions[i].y == 0 || game[(tabCoordPions[i].x)][tabCoordPions[i].y-1] == 0 ) &&
                (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] != 1 || game[tabCoordPions[i].x+1][(tabCoordPions[i].y)] != 1 ||
                game[tabCoordPions[i].x][(tabCoordPions[i].y)+1] != 1)
                ) ||
            ( (tabCoordPions[i].y == Rows-1 || game[(tabCoordPions[i].x)][tabCoordPions[i].y+1] == 0 ) &&
                (game[(tabCoordPions[i].x)-1][tabCoordPions[i].y] != 1 || game[tabCoordPions[i].x+1][(tabCoordPions[i].y)] != 1 ||
                game[tabCoordPions[i].x][(tabCoordPions[i].y)-1] != 1)
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

    // on prend un chiffre au hasard entre 0 et le nombre total de pierre d'extrémité
    var whichOne = Math.floor(Math.random()* tabExtPionsIntGr.length);


    // on récupère les coordonnées du pion corresondant au numéro tiré
    var selectedStoneCoord = tabExtPionsIntGr[whichOne];
    var tabSelectedStoneCoord = [];


    // on determine quelles sont les coordonnées des libertés de ce pion et on stock les coordonnées du pion dans un tableau
    if (tabExtPionsIntGr[whichOne].x != Rows-1 && game[tabExtPionsIntGr[whichOne].x +1][tabExtPionsIntGr[whichOne].y] == 0) {
        tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x +1, y: tabExtPionsIntGr[whichOne].y});
    }

    if (tabExtPionsIntGr[whichOne].x != 0 && game[tabExtPionsIntGr[whichOne].x -1][tabExtPionsIntGr[whichOne].y] == 0) {
        tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x -1, y: tabExtPionsIntGr[whichOne].y});
    }

    if (tabExtPionsIntGr[whichOne].y != Rows-1 && game[tabExtPionsIntGr[whichOne].x][tabExtPionsIntGr[whichOne].y+1] == 0) {
        tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x, y: tabExtPionsIntGr[whichOne].y +1});
    }

    if (tabExtPionsIntGr[whichOne].y != 0 && game[tabExtPionsIntGr[whichOne].x][tabExtPionsIntGr[whichOne].y-1] == 0) {
        tabSelectedStoneCoord.push({x: tabExtPionsIntGr[whichOne].x, y: tabExtPionsIntGr[whichOne].y -1});
    }


    // on joue sur une de ces coordonées au hasard en tirant un numéro aléatoire entre 0 et le nombre total de liberté
    var tabSelectedStoneLibCoord = Math.floor(Math.random()* tabSelectedStoneCoord.length);

    return [tabSelectedStoneCoord[tabSelectedStoneLibCoord].x, tabSelectedStoneCoord[tabSelectedStoneLibCoord].y];

}

function iamode () {

    actualisationGroups();
 
    var newStone = play();
    var rand1 = newStone[0];
    var rand2 = newStone[1];

    var random = rand1+"_"+rand2;

    //console.log('ia joue ici"'+ random +'"');


    toggle(random);

    tempPlayer = player;
    player = waitingPlayer;
    waitingPlayer = tempPlayer;

    //console.log("player2="+ player);
}