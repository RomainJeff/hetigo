var Columns = 9;
var Rows = 9;
var player = 1; // 1 = black, 2 = white
var tour = 1;
var waitingPlayer = 2;

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
        game[i][j][0]=2;
        game[i][j][0]=0;
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
    console.log(cellid);
    var indexTiret = cellid.indexOf("_");
    var x = parseInt(cellid.substring(0, indexTiret));
    var y = parseInt(cellid.substring(indexTiret+1));
    
    if (game[x][y][0]!=0 || suicide(x,y)==true || ko(x,y)==true)
    {
        console.log("Impossible de jouer ici");
        return;
    }
    else
    {
        console.log(game[x][y][0]);
        game[x][y][0]=player;
        game[x][y][tour]=player;
        console.log(game[x][y][0]);
        
        actualisationGroups();
        capture(x,y);
        graphisme();
        tour++;
        playerTurn();
    }

}



function suicide (x,y)
{
    var lib1 = game[x][y-1][0];
    var lib2 = game[x+1][y][0];
    var lib3 = game[x][y+1][0];
    var lib4 = game[x-1][y][0];

    if ((lib1 && lib2 && lib3 && lib4 == waitingPlayer) || (libertiesGroup(x,y)==true))
 {
 return true;
 }
 else
 {
 return false;
 }
    
}



function ko (x,y)
{
    return false;
}



function capture (x,y)
{
    
}



function actualisationGroups ()
{
    for (i=0; i<Rows; i++)
    {
        for (j=0; j<Columns; j++)
        {
            group[i][j]=0;
        }}
    
    var Num_Groupe = 1;
    for (i=0; i<Rows; i++)
    {
        for (j=0; j<Columns; j++)
        {
            if ( game[i][j][0]==0)
            {
                group[i][j]=0;
            }
            else if ( (j-1)>0 && game[i][j][0] == game[i][j-1][0])
            {
                var ancienG = group[i][j];
                group[i][j] = group[i][j-1];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Columns; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                            console.log("yo");
                        }
                    }
                }
            }
            else if ( (i+1)>Rows && game[i][j][0] == game[i+1][j][0])
            {
                var ancienG = group[i][j];
                group[i][j] = group[i+1][j];
                for (k=0; k<Rows; k++)
                {
                    for (l=0; l<Columns; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            else if ( (j+1)<Rows && game[i][j][0] == game[i][j+1][0] )
            {
                var ancienG = group[i][j];
                group[i][j] = group[i][j+1];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Columns; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }
            }
            else if ( (i-1)>0 && game[i][j][0] == game[i-1][j][0])
            {
                var ancienG = group[i][j];
                group[i][j] = group[i-1][j];
                for (var k=0; k<Rows; k++)
                {
                    for (var l=0; l<Columns; l++)
                    {
                        if (group[k][l] == ancienG)
                        {
                            group[k][l] = group[i][j];
                        }
                    }
                }}
            else
            {
                group[i][j] = Num_Groupe;
                Num_Groupe++;
            }
        }
    }
    
    for (i=0; i<Rows; i++)
    {
        for (j=0; j<Columns; j++)
        {
    
    console.log("groupe" + group[i][j]);
        }}
}



function libertiesGroup (x,y)
{
    
}



function playerTurn ()
{
    if (player == 1)
    {
        waitingPlayer = 1;
        player = 2;
    }  
    else
    {
        waitingPlayer = 2;
        player = 1;   
    }
}



function graphisme ()
{
    for (var i=0; i<Rows; i++)
    {
        for (var j=0; j<Columns; j++)
        {
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
