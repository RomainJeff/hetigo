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
    
    
