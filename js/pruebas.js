var formContainer = null;
var nota = 0.0;
var preguntasSelect = [];
window.onload = function(){ 
	//CORREGIR al apretar el botón
	formContainer=document.getElementById('myform');
	formContainer.onsubmit=function(){

	inicializar();
 	presentarNota();
 	return false;

 }

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
			case "checkbox":
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCheckBox(i, xmlDoc);
				break;
			case "radio":
				imprimirTituloPregunta(i, xmlDoc);
				imprimirRadioButton(i, xmlDoc);
				break;
			case "select multiple":
				imprimirTituloPregunta(i, xmlDoc);
				imprimirSelectMultiple(i, xmlDoc);
				break;
		}
	}
	imprimirEspacios(3);
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


function imprimirCheckBox(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var label = document.createElement("label");
		var input = document.createElement("input");
		label.innerHTML=opt[j].innerHTML;
		input.type="checkbox";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		formContainer.appendChild(input);
		formContainer.appendChild(label);
		formContainer.appendChild(document.createElement("br"));
	}
}

function imprimirRadioButton(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	for (j = 0; j < numOpciones; j++) {
		var input = document.createElement("input");
		var answerTitle = opt[j].innerHTML;
		var span = document.createElement("span");
		span.innerHTML = answerTitle;
		input.type="radio";
		input.name="preg"+i;
		input.id="preg"+i+"ans"+j;
		formContainer.appendChild(input);
		formContainer.appendChild(span);
		formContainer.appendChild(document.createElement("br"));
	}	
}

function imprimirSelectMultiple(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var selectMultiple = document.createElement("select");
	selectMultiple.multiple="true";
	for (j = 0; j < numOpciones; j++) {
		var answerTitle = opt[j].innerHTML;
		var option = document.createElement("option");
		option.innerHTML = answerTitle;
		selectMultiple.appendChild(option);
		}
	formContainer.appendChild(selectMultiple);
}

function imprimirEspacios(numeroEspacios) {
	for (i=0; i<numeroEspacios; i++) {
		var espacio = document.createElement("br");
		formContainer.appendChild(espacio);
	}
}

function imprimirBotonCorregir() {
	var botonCorregir = document.createElement("input");
	botonCorregir.type = "submit";
	botonCorregir.value = "Corregir";
	formContainer.appendChild(botonCorregir);
}

//Correciones ************************************************************************

function inicializar(){
	document.getElementById('resultadosDiv').innerHTML = "";
	nota=0.0;
}

function darRespuestaHtml(r){
	var p = document.createElement("p");
	var node = document.createTextNode(r);
	p.appendChild(node);
	document.getElementById('resultadosDiv').appendChild(p);
}

function presentarNota(){
	darRespuestaHtml("Nota: "+nota+" puntos sobre 3");
}

window.onmousedown = function (e) {
    var el = e.target;
    if (el.tagName.toLowerCase() == 'option' && el.parentNode.hasAttribute('multiple')) {
        e.preventDefault();

        // toggle selection
        if (el.hasAttribute('selected')) el.removeAttribute('selected');
        else el.setAttribute('selected', '');

        // hack to correct buggy behavior
        var select = el.parentNode.cloneNode(true);
        el.parentNode.parentNode.replaceChild(select, el.parentNode);
    }
}

//Comprobar que se han introducido datos en el formulario
