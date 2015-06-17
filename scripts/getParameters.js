var url = window.location.search.substring(1).split("&") ;
// var url = window.location.search.substring(1);
//console.log(url);

var egalLocation = url[0].indexOf("=") + 1;
var perso = url[0].substring(egalLocation);
console.log("perso: " + perso);

var egalLocation = url[1].indexOf("=") + 1;
var playerMode = url[1].substring(egalLocation);
console.log("playerMode: " + playerMode);

var egalLocation = url[2].indexOf("=") + 1;
var handicap = url[2].substring(egalLocation);
console.log("handicap: " + handicap);
