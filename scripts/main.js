var Columns = 9;
var Rows = 9;
var player; // 1 = black, 2 = white
var tour = 1;

var group = new Array();
for (var i=0; i<Rows; i++)
{
    group[i]=new Array ();
}

var prisoner1 = 0; // Prisoners of player 1 (black)
var prisoner2 = 0; // Prisoners of player 2 (white) 

var game = new Array(); 
for (var i=0; i<Rows; i++)
{
    game[i]=new Array ();
    for (var j=0; j<Columns; j++)
    {
        game[i][j]=new Array();
    }
}
     

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



function suicide (x,y)
{
    
}



function ko (x,y)
{
    
}



function capture (x,y)
{
    
}



function actualisationGroups ()
{
    
}



function libertiesGroup (x,y)
{
    
}



function playerTurn ()
{
    
}



function graphisme ()
{
    
}
