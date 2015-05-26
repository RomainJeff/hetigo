function checkForm () {
    // VERIF FORMULAIRE
    
    var formulaire=document.forms["parameters"];
	var erreur=false;
	var texteErreur=new Array();

	var mode=formulaire.elements["playerMode"];
	var check=false;
	for (var i=0; i<mode.length; i++)
	{
		if(mode[i].checked==true)
		{
			check=true;
		}
	}
	if(check==false){
		erreur=true;
		texteErreur[texteErreur.length]="Sélectionnez votre mode de jeu";
	}
    
    var handicap=formulaire.elements["handicap"];
	var check=false;
	for (var i=0; i<handicap.length; i++)
	{
		if(handicap[i].checked==true)
		{
			check=true;
		}
	}
	if(check==false){
		erreur=true;
		texteErreur[texteErreur.length]="Sélectionnez si vous desirez un handicap ou pas";
	}

    
    if(erreur==true)
	{
		document.getElementById("caseErreurs").innerHTML=(texteErreur.join("</br>"))
		document.getElementById("caseErreurs").style.display=("block");
		return false;
	}
	else
	{
		return true;
	}
 
}