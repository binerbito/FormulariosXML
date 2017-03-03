var formContainer = null;
var nota = 0.0;

var preguntasSelect = [];
var respuestasSelect = [];

var preguntasText = [];
var respuestasText = [];

var preguntasCheckBox = [];
var respuestasCheckBox = [];


window.onload = function(){ 
	//CORREGIR al apretar el botón
	formContainer=document.getElementById('myform');
	formContainer.onsubmit=function(){
		inicializar();
		corregirSelect();
		corregirText();
		corregirCheckBox();
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
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirOpcionesSelect(i, xmlDoc);
				preguntasSelect.push(i);
				respuestasSelect.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				break;
			case "text":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCajaText(numeroCajaTexto, xmlDoc);
				numeroCajaTexto++;
				preguntasText.push(i);
				respuestasText.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[0].innerHTML));
				break;
			case "checkbox":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirCheckBox(i, xmlDoc);
				preguntasCheckBox.push(i);
				agregarRespuestasCheckbox(i, xmlDoc);
				break;
			case "radio":
				crearDivPregunta(i);
				imprimirTituloPregunta(i, xmlDoc);
				imprimirRadioButton(i, xmlDoc);
				break;
			case "select multiple":
				crearDivPregunta(i);
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
	document.getElementById('pregunta'+i).appendChild(tituloPregunta);
}

function imprimirOpcionesSelect(i, xmlDoc) {
	var numOpciones = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option').length;
	var opt = xmlDoc.getElementsByTagName('question')[i].getElementsByTagName('option');
	var select = document.createElement("select");
	select.id = "select"+i;
	document.getElementById('pregunta'+i).appendChild(select);
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
	document.getElementById('pregunta'+i).appendChild(cajaTexto);
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
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(label);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
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
		document.getElementById('pregunta'+i).appendChild(input);
		document.getElementById('pregunta'+i).appendChild(span);
		document.getElementById('pregunta'+i).appendChild(document.createElement("br"));
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
	document.getElementById('pregunta'+i).appendChild(selectMultiple);
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

//CORREGIR
function corregirSelect() {
  //Compara el índice seleccionado con el valor del íncide que hay en el xml (<answer>2</answer>)
  //para implementarlo con type radio, usar value para enumerar las opciones <input type='radio' value='1'>...
  //luego comparar ese value con el value guardado en answer
  for (i = 0; i<preguntasSelect.length; i++) {
  	var sel = formContainer.elements[preguntasSelect[i]];  
  	var respuesta = respuestasSelect[i];
  	if (sel.selectedIndex==respuesta) { 
  		darRespuestaHtml("P" +preguntasSelect[i]+": Correcto");
  		nota +=1;
  	}
  	else darRespuestaHtml("P" +preguntasSelect[i]+ ": Incorrecto");
  }
}

function corregirText() {
	for (i = 0; i<preguntasText.length; i++) {
		var sel = formContainer.elements[preguntasText[i]];
		var respuesta = respuestasText[i];
		if (sel.value == respuesta){
			darRespuestaHtml("P" +preguntasText[i]+": Correcto");
			nota += 1;
		} 
		else darRespuestaHtml("P" +preguntasText[i] + ": Incorrecto");
	}
}

function corregirCheckBox(){
	for (i = 0; i<preguntasCheckBox.length; i++) {
		//var input = formContainer.getElementsByTagName('input')[].getAttribute('name')=="preg"+preguntasCheckBox[i];
		//alert(input);
	}
}

function agregarRespuestasCheckbox(i, xmlDoc) {
	var respuestasPregunta = [];
	for (j= 0; j <xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer").length; j++) {
		respuestasPregunta.push(parseInt(xmlDoc.getElementsByTagName("question")[i].getElementsByTagName("answer")[j].innerHTML));
	}
	respuestasCheckBox.push(respuestasPregunta);
}

//UTILIDADES

function crearDivPregunta(i) {
	var div = document.createElement('div');
	div.id = "pregunta"+i;
	formContainer.appendChild(div);
}

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
	darRespuestaHtml("Nota: "+nota+" puntos sobre 10");
}

	//funcion para hacer que el select multiple se pueda aplicar sin la tecla Ctrl
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
/*
function comprobar(){
	var f=formContainer;
	var checked=false;
    for (i = 0; i < f.color.length; i++) {  //"color" es el nombre asignado a todos los checkbox
    	if (f.color[i].checked) checked=true;
	}
	if (f.elements[0].value=="") {
		f.elements[0].focus();
		alert("Escribe un número");
		return false;
	} else if (f.elements[1].selectedIndex==0) {
		f.elements[1].focus();
		alert("Selecciona una opción");
		return false;
	} if (!checked) {    
		document.getElementsByTagName("h3")[2].focus();
		alert("Selecciona una opción del checkbox");
		return false;
	} else  return true;
}
*/

//futuras ideas: clasificar las preguntas por divs