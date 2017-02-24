var formContainer = null;

window.onload = function(){ 
	formContainer = document.getElementById('myform');
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
	var numeroCajaTexto = 0;
	for (i = 0; i<10; i++) {
		tipo = xmlDoc.getElementsByTagName("type")[i].innerHTML;
		switch(tipo) {
			case "select": 
				imprimirTituloPregunta(i, xmlDoc);
				imprimirOpcionesSelect(i, xmlDoc);
				break;
			case "text":
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCajaText(numeroCajaTexto, xmlDoc);
				numeroCajaTexto++;
				break;
		}
	}
	imprimirEspacio();
	imprimirEspacio();
	imprimirBotonCorregir();
}


//se le pasa una pregunta del xml y busca su atributo title y lo plasma en un <h3> en el html
function imprimirTituloPregunta(i, xmlDoc){
	var tituloPregunta = document.createElement("h3");
	tituloPregunta.innerHTML=xmlDoc.getElementsByTagName("title")[i].innerHTML;
	formContainer.appendChild(tituloPregunta);
}

function imprimirOpcionesSelect(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var select = document.createElement("select");
	select.id = "select"+i;
	formContainer.appendChild(select);
	for (j = 0; j < numOpciones; j++) { 
		var option = document.createElement("option");
		option.text = opt[j].innerHTML;
		option.value = j ;
		select.options.add(option);
	}  
}

function imprimirCajaText(numeroCajaTexto, xmlDoc) {
	var cajaTexto = document.createElement("input");
	cajaTexto.type = "number";
	cajaTexto.id = "cajaTexto" + numeroCajaTexto;
	formContainer.appendChild(cajaTexto);
}

function imprimirBotonCorregir() {
	var botonCorregir = document.createElement("input");
	botonCorregir.type = "submit";
	botonCorregir.value = "Corregir";
	formContainer.appendChild(botonCorregir);
}

function imprimirEspacio() {
	var espacio = document.createElement("br");
	formContainer.appendChild(espacio);
}