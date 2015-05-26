/*var url = window.location.search.substring(1).split(&) ;*/
var url = window.location.search.substring(1);
console.log(url);

var egalLocation = url.indexOf("=")+1;
var playerMode = url.substring(egalLocation);
console.log(playerMode);