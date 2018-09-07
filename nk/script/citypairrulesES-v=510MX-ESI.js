//
// File Version: 52.50
//
var StationsTimeTable = new Array();
StationsTimeTable["ANYANY"] = new Array(new StationTimeTable("ANY", "ANY", "5/2/2019", "12/31/2028", new Array("False","False","False","False","False","False","False"), "Spirit Airlines tiene tarifas preparadas y disponibles para viajar hasta el 1 de mayo 2019. Los horarios para viajar después de esa fecha seran publicadas en un futuro cercano."));
StationsTimeTable["ANYPBI"] = new Array(new StationTimeTable("ANY", "PBI", "5/21/2018", "11/7/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde West Palm Beach, FL comienza en 8 de noviembre, 2018"));
StationsTimeTable["CRWANY"] = new Array(new StationTimeTable("CRW", "ANY", "9/6/2018", "2/13/2019", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Charleston, WV termina en 5 de septiembre, 2018"));
StationsTimeTable["PBIANY"] = new Array(new StationTimeTable("PBI", "ANY", "5/21/2018", "11/7/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde West Palm Beach, FL comienza en 8 de noviembre, 2018"));
StationsTimeTable["ANYCRW"] = new Array(new StationTimeTable("ANY", "CRW", "9/6/2018", "2/13/2019", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Charleston, WV termina en 5 de septiembre, 2018"));
StationsTimeTable["ANYGSO"] = new Array(new StationTimeTable("ANY", "GSO", "6/4/2018", "9/5/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Greensboro/Winston-Salem, NC comienza en 6 de septiembre 2018"));
StationsTimeTable["GSOANY"] = new Array(new StationTimeTable("GSO", "ANY", "6/4/2018", "9/5/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Greensboro/Winston-Salem, NC comienza en 6 de septiembre 2018"));
StationsTimeTable["ANYAVL"] = new Array(new StationTimeTable("ANY", "AVL", "6/13/2018", "9/5/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Asheville, NC comienza en 6 de septiembre 2018"));
StationsTimeTable["AVLANY"] = new Array(new StationTimeTable("AVL", "ANY", "6/13/2018", "9/5/2018", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde Asheville, NC comienza en 6 de septiembre 2018"));
StationsTimeTable["ANYSJD"] = new Array(new StationTimeTable("ANY", "SJD", "9/6/2018", "5/1/2019", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde San Jose del Cabo, Mexico termina en 5 de septiembre, 2018"));
StationsTimeTable["SJDANY"] = new Array(new StationTimeTable("SJD", "ANY", "9/6/2018", "5/1/2019", new Array("False","False","False","False","False","False","False"), "El servicio hacia/desde San Jose del Cabo, Mexico termina en 5 de septiembre, 2018"));
function StationTimeTable(origin, destination, startdate, enddate, daysArray, message)
{
	this.origin = origin;
	this.destination = destination;
	this.startdate = startdate;
	this.enddate = enddate;
	this.days = daysArray;
	this.message = message;
}
