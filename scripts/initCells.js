var Rows = 19;

displayCellState();
backgroundBoard();



function displayCellState() {
    
    var grid='';


    for (var i=0;i<Rows; i++) {	
        
        for (var j=0;j<Rows; j++){ 
            grid+= '<div id="'+i+'_'+j+'"class="empty" onclick="toggle(id);"></div>';
        }	 

    }

    document.getElementById("goban").innerHTML = grid;
}

function backgroundBoard(){
    
    var bg='';
    

    
    for (var i=0;i<(Rows-1); i++) {
        for (var j=0;j<(Rows-1); j++){  
            bg+='<div class="bgIntersection"></div>';
        }
  
    }
    document.getElementById("background").innerHTML = bg;
}
