
/*

var game[][][];

// 1ere et 2 eme dimensions = plateau de jeu actuel (mis à jour à chaque tour)
// 3 eme dimensio, enregistre les pions à chaque tour (1pion par case)
// etatJeu[x][y][0] = actualisé à chaque fois, toutp plateau enregistré
// etatJeu[x][y][1], etatJeu[x][y][2], etatJeu[x][y][tour] etc. = pion joué enregsitré à chaque fois

var tour = 1;

var group[][]; // Group of each cell

var prisonnier;


function 


*/

var Columns = 9;
var Rows = 9; 
var joueur = 0;


displayCellState();



function displayCellState()
{
    var grid='';

    document.getElementById("goban").innerHTML = "";	

    for (var i=0;i<Rows; i++)
    {
        grid+="<div class='lines'>";	
        
        for (var j=0;j<Columns; j++){
            
            grid+= '<div id="' + (i+"_"+j) +'" class="empty" onclick="toggle(id);"></div>';

        }	
        
        grid=grid+'</div>';
        
    }

    document.getElementById("goban").innerHTML = grid;

}



function toggle(cellid)
{

    var element = document.getElementById(cellid);
    element.setAttribute("class", "black");
    

}
    

