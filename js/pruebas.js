window.onload = function(){ 

	var formContainer = document.getElementById("myform");

	//LEER XML de xml/preguntas.xml
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			gestionarXml(this);
		}
	};
	xhttp.open("GET", "xml/preguntas.xml", true);
	xhttp.send();
}



// Recuperamos los datos del fichero XML xml/preguntas.xml
// xmlDOC es el documento leido XML. 
function gestionarXml(dadesXml){
	var xmlDoc = dadesXml.responseXML; //Parse XML to xmlDoc
	var tipo = "";
	for (i = 0; i<10; i++) {
		tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
		switch(tipo) {
			case "select": 
				imprimirPreguntaSelect(i, xmlDoc);
				break;
		}
	}
}


function imprimirPreguntaSelect(i, xmlDoc){
	var titleQuestion = document.createElement('h3');
	titleQuestion.innerHTML("HOLA");
	formContainer.appendChild(titleQuestion);
}