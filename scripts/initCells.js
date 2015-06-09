var Rows = 19;

var player = 1; // 1 = black, 2 = white
var waitingPlayer = 2;
displayCellState();
backgroundBoard();



function displayCellState() {
    
    var grid='';


    for (var i=0;i<Rows; i++) {	
        
        for (var j=0;j<Rows; j++){ 
            grid+= '<div id="'+i+'_'+j+'"class="empty" ></div>';
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

// Declaration des clicks
    for (var i=0; i < Rows; i++) {
        for (var j=0; j< Rows; j++) {
            document.getElementById(i +'_'+ j).addEventListener("click", function(){
                var cellid = this.id;

                // Si on est en mode IA
                // et que c'est a l'IA de jouer
                if (playerMode == 3 && player != 1)
                    return;

                toggle(cellid);
            });

        }
    }


