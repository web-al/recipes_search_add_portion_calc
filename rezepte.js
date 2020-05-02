"use strict";

// Request
let json;
let request = new XMLHttpRequest();
request.onload = () => {
	if (request.status === 200)
	{
		if (request.responseType === 'json')
		{
			json = request.response;			
		}
		else
		{
			json = JSON.parse(request.responseText);
    	}
  	}
}

request.open('GET', 'rezepte.json');
request.responseType = 'json';
request.setRequestHeader('Accept', 'application/json');
request.send(); 

// Alle Rezepte ausgeben (section id="show")
let btnAllRecipes = document.querySelector("#btn-all-recipes");
btnAllRecipes.addEventListener("click", ()  => allRecipes());

function allRecipes() { 
    var x = document.getElementById("div-all-recipes");
    if (x.textContent === "" || x.style.display === "none") {
        event.target.innerText = 'Verberge alle Rezepte';
        x.style.display = "block";
    } else {
        event.target.innerText = 'Zeige alle Rezepte';
        x.style.display = "none";
    } 

    // div-Inhalt erstmal leeren:
	// document.querySelector("#div-all-recipes").textContent = ""; 
	for (let i = 0; i < json.rezepte.length; i++) {
		let rezepte = createElem("div");
        let titel = createElem("p", "Titel: " + json.rezepte[i].titel);
		let untertitel = createElem("p", json.rezepte[i].untertitel);
	
		let zutaten = createElem("p");
		zutaten.textContent = "Zutaten: " + JSON.stringify(json.rezepte[i].zutaten).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge/g, " menge").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/zutat:/g, "").replace(/,,/g, ",").replace(/,/g, " ").replace(/  /g, ", ");

		// Array für Zutaten
		let zutaten2 = createElem("p");		
		zutaten2 = JSON.stringify(json.rezepte[i].zutaten).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge/g, " menge").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/zutat:/g, "").replace(/,,/g, ",").replace(/,/g, " ").replace(/  /g, ",");
		let zutatenArray = zutaten2.split(",");
		console.log(zutatenArray);

		let zeit = createElem("p");
		zeit.textContent = "Zubereitungszeit: " + JSON.stringify(json.rezepte[i].zubereitungszeit).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/,/g, " ");
		
        let zubereitung = createElem("p", "Zubereitung: " + json.rezepte[i].zubereitung);

        // rezepte.appendChild(titel).style.fontWeight = "900";
        rezepte.appendChild(untertitel).style.fontWeight = "900";
		rezepte.appendChild(zutaten);
		rezepte.appendChild(zeit);
        rezepte.appendChild(zubereitung);
            
        document.querySelector("#div-all-recipes").appendChild(rezepte);
  	}
}

// Suche nach Titel (section id=search)
const rezeptAbgleich = (aktRezept) => {
	let userdata;
	if (document.querySelectorAll("#titel_suche + div").length != 0) {
    	document.querySelector("#titel_suche + div").remove();
	}
	
	for (let i = 0; i < json.rezepte.length; i++) {
		if (json.rezepte[i].titel == aktRezept) {
			userdata = json.rezepte[i];
        } 
	}
	
	if (userdata !== undefined) {
		document.querySelector("#titel_suche").textContent = "";
		
		let rezepte = createElem("div");
        let titel = createElem("p", "Titel: " + userdata.titel);
		let untertitel = createElem("p", userdata.untertitel);
		
		let zutaten = createElem("p");
		zutaten.textContent = "Zutaten: " + JSON.stringify(userdata.zutaten).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge/g, " menge").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/zutat:/g, "").replace(/,,/g, ",").replace(/,/g, " ").replace(/  /g, ", ");

		let zeit = createElem("p");
		zeit.textContent = "Zubereitungszeit: " + JSON.stringify(userdata.zubereitungszeit).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/,/g, " ");
   
        let zubereitung = createElem("p", "Zubereitung: " + userdata.zubereitung);

        rezepte.appendChild(untertitel).style.fontWeight = "900";
		rezepte.appendChild(zutaten);
		rezepte.appendChild(zeit);
        rezepte.appendChild(zubereitung);
            
        document.querySelector("#titel_suche").appendChild(rezepte);
    }
	else {  
        document.querySelector("#titel_suche").textContent = "Leider wurde kein passendes Rezept gefunden!";
    }
}

let userSearch = document.querySelector("#titel");
userSearch.addEventListener("input", ()  => rezeptAbgleich(userSearch.value));

function createElem(elem, text="") {
	let element = document.createElement(elem);
	element.textContent = text;
	return element;
}

// Suche nach Zutat (section id=search)
// ...
  

// Nutzereingabe eigene Rezepte

// neue XMLHttpRequest Instanz erzeugen, damit die Nutzerrezepte in einer eigenen JSON Datei abgespeichert werden können (user_rezepte.json)
let jsonTwo;
let requestTwo = new XMLHttpRequest();
requestTwo.onload = () => {
	if (requestTwo.status === 200)
	{
		if (requestTwo.responseType === 'json')
		{
			jsonTwo = requestTwo.response;			
		}
		else
		{
			jsonTwo = JSON.parse(requestTwo.responseText);
    	}
  	}
}

requestTwo.open('GET', 'user_rezepte.json');
requestTwo.responseType = 'json';
requestTwo.setRequestHeader('Accept', 'application/json');
requestTwo.send(); 

// Button für das Hinzufügen der Zutaten und des Rezepts als Ganzes erzeugen
let addIngredientButton = document.querySelector("#add_ingredient");
let addRecipeButton = document.querySelector("#add-custom-recipe");
// auf die DOM Elemente Zugreifen
let recipeTitle = document.querySelector("#recipe-title .name");
let recipeSubTitle = document.querySelector("#recipe-subtitle .sub-name");
let recipeDuration = document.querySelector("#recipe-duration .duration");
let recipePreparation = document.querySelector("#recipe-preparation .preparation");
let recipeIngredientsQuantity = document.querySelector("#new-ingredients .quantity")
let recipeIngredientsUnit = document.querySelector("#new-ingredients .unit")
let recipeIngredientsIngredient = document.querySelector("#new-ingredients .ingredient")
let showRecipe = document.querySelector("#show-recipe");
let customerIngredients = document.querySelector("#customer-ingredients");

// Die beiden Buttons mit Eventlistenern versehen
addIngredientButton.addEventListener("click", addIngredients);
addRecipeButton.addEventListener("click", addRecipe);

// Die eigenen Zutaten erzeugen. Dabei werden Menge, Einheit und Zutat in einzelne span-tags gepackt und dann wiederum in ein eigenes p-tag. So können sie später für die korrekte Überführung in die JSON Objekte einzelnen selektiert werden;
// zusätzlich wird ein Button zum löschen der jeweiligen Zutat erzeugt, in ein separates p-tag gepackt und auch mit eingehängt
function addIngredients () {
    let ingredientContainer = document.createElement("div");
    let ingredientInput = document.createElement("p");
    let ingredientInputQuantity = document.createElement("span");
    let ingredientInputUnit = document.createElement("span");
    let ingredientInputIngredient = document.createElement("span");
    let removeIngredientContainer = document.createElement("p");
    ingredientInput.classList.add("ingredient-input")
    ingredientInputQuantity.classList.add("ingredient-quantity");
    ingredientInputUnit.classList.add("ingredient-unit");
    ingredientInputIngredient.classList.add("ingredient-ingredient");
    removeIngredientContainer.classList.add("remove-product");
    let addRemoveButton = document.createElement("button");
    addRemoveButton.textContent = "Zutat entfernen";                           
    addRemoveButton.addEventListener("click", (event) => {
            event.target.parentNode.parentNode.remove();
    });
    removeIngredientContainer.appendChild(addRemoveButton);
    let valueIngredientQuantity = recipeIngredientsQuantity.value;
    let valueIngredientUnit = recipeIngredientsUnit.value;
    let valueIngredientIngredient = recipeIngredientsIngredient.value;
    ingredientInputQuantity.textContent = valueIngredientQuantity + " ";
    ingredientInputUnit.textContent = valueIngredientUnit + " ";
    ingredientInputIngredient.textContent = valueIngredientIngredient;
    ingredientInput.classList.add("customer-recipe-ingredients")
    ingredientInput.appendChild(ingredientInputQuantity);
    ingredientInput.appendChild(ingredientInputUnit);
    ingredientInput.appendChild(ingredientInputIngredient);
    ingredientContainer.appendChild(ingredientInput);
    ingredientContainer.appendChild(removeIngredientContainer);
    customerIngredients.appendChild(ingredientContainer);
    
}

// Title, Untertitel, Zubereitungszeit, Zutaten und Zubereiung dem Rezept hinzufügen
function addRecipe () {
    // wenn schon ein Rezept angezeigt wird, soll dieses beim neuen Erstellen nicht mehr mit angezeigt werden und daher muss es erst gelöscht werden, bevor ein neues Erzeugt wird
    while (showRecipe.firstChild) {
		showRecipe.removeChild(showRecipe.firstChild);
	}
    // die DOM Elemente erstellen
    let valueRecipe = document.createElement("div");
    let valueRecipeTitel = document.createElement("p");
    let valueRecipeSubTitel = document.createElement("p");
    let valueRecipePreparation = document.createElement("p");
    let valueRecipeDuration = document.createElement("p");
    let valueRecipeCustomerIngredients = document.createElement("p");
    //  mit Nutzerinhalt versehen
    let valueTitle = recipeTitle.value;
    let valueSubTitle = recipeSubTitle.value;
    let valuePreparation = recipePreparation.value;
    let valueDuration = recipeDuration.value;
    valueRecipeTitel.textContent = "Titel: " + valueTitle;
    valueRecipeSubTitel.textContent = "Untertitel: " + valueSubTitle;
    valueRecipePreparation.textContent = "Zubereitung: " + valuePreparation;
    valueRecipeDuration.textContent = "Zubereitungszeit: " + valueDuration + " Minuten";
    // die Zutaten werden dabei erst einzeln mit Menge, Einheit und Zutat erfasst und dann alle gemeinsam in einen String konvertiert, damit die Ausgabe ähnlich wie die bereits bestehenden Rezepte aussieht
    let valuesCustomerIngredients = document.querySelectorAll(".customer-recipe-ingredients");
    valuesCustomerIngredients = Array.from(valuesCustomerIngredients);
    valuesCustomerIngredients = valuesCustomerIngredients.map(text => text.textContent).join(", ");
    valueRecipeCustomerIngredients.textContent = "Zutaten: " + valuesCustomerIngredients;
    // die einzelnen Elemente einhängen
    valueRecipe.appendChild(valueRecipeTitel);  
    valueRecipe.appendChild(valueRecipeSubTitel);  
    valueRecipe.appendChild(valueRecipePreparation);
    valueRecipe.appendChild(valueRecipeDuration);
    valueRecipe.appendChild(valueRecipeCustomerIngredients);
    showRecipe.appendChild(valueRecipe);
    // console.log(valuesCustomerIngredients);
    // und noch einen Button für das Speichern in der JSON user-rezepte.json Datei erzeugen und einhängen
    let sendButtonToJson = document.createElement("button");
    sendButtonToJson.classList.add("send-to-json");
    sendButtonToJson.textContent = "Rezept speichern";
    showRecipe.appendChild(sendButtonToJson);
    sendButtonToJson.addEventListener("click", addRecipeToJson);
}


// Rezepte der Datei hinzufügen
function addRecipeToJson () {
    let recipeTitles = jsonTwo.rezepte;
    let recipeTitle = document.querySelector("#recipe-title .name");
    let valueCustomerTitle = recipeTitle.value;
    let found = recipeTitles.find(elem => elem.titel == valueCustomerTitle); 
    // console.log(valueCustomerTitle);
    // Falls schon ein Rezept mit dem selben Titel hinterlegt ist, wird eine Fehlermeldung ausgegeben
    if (typeof found != "undefined") {
        // console.log("Rezept bereits vorhanden");
        let sendToJsonFail = document.createElement("p");
        sendToJsonFail.classList.add("send-to-json-failed");
        sendToJsonFail.textContent = "Dieser Rezepttitel ist bereits vergeben. Bitte ändern sie ihren Titel";
        showRecipe.appendChild(sendToJsonFail);
    } else {
        // sonst wird das Rezept mit den Inhalten der Nutzereingaben erstellt
        let newCustomerRecipeTitle = recipeTitle.value;
        let newCustomerRecipeSubTitle = recipeSubTitle.value;
        let newCustomerRecipePreparation = recipePreparation.value;
        // die Zubereitungszeit muss als Number abgelegt werden
        let newCustomerRecipeDuration = Number(recipeDuration.value);
        //  und die Zutaten erst alle ausgewählt werden und in ein Array überführt werden
        let newCustomerRecipeIngredients = document.querySelectorAll(".customer-recipe-ingredients");
        newCustomerRecipeIngredients = Array.from(newCustomerRecipeIngredients);
        // console.log(newCustomerRecipeIngredients);
        // dann können die einzelnen Zutaten durchgegangen werden und für jede Zutat mittels der span-tags jeweile Menge, Einheit und Zutat mit den Werten verbunden werden und als Objekt angelegt werden
        let ingredientsArray = [];
        newCustomerRecipeIngredients.map(element => {
            let newElement = {menge: Number(element.childNodes[0].textContent), einheit: element.childNodes[1].textContent, zutat: element.childNodes[2].textContent};
            // diese werden in ein neues Array überführt
            ingredientsArray.push(newElement);
        })
        // console.log(ingredientsArray);
        // das neue Array mit den Zutatenobjekten kann dann als genau wie alle anderen Eingaben an JSON übergeben werden
        let newCustomerRecipe = {titel: newCustomerRecipeTitle, untertitel: newCustomerRecipeSubTitle, zutaten: ingredientsArray, zubereitungszeit: newCustomerRecipeDuration, zubereitung: newCustomerRecipePreparation};
        jsonTwo.rezepte.push(newCustomerRecipe);
        // falls das Speichern erfolgreich war, wird dem Nutzer noch eine Info gegeben
        let sendToJsonSucces = document.createElement("p");
        sendToJsonSucces.classList.add("send-to-json-sucess");
        sendToJsonSucces.textContent = "Ihr Rezept wurde erfolgreich gespeichert";
        showRecipe.appendChild(sendToJsonSucces);
    }

    sendFile(JSON.stringify(jsonTwo));
    // console.log(JSON.stringify(jsonTwo))
}

function sendFile (newCustomerRecipeFile) {
    let sendRequest = new XMLHttpRequest();
    sendRequest.onload = () => {
        if (sendRequest.status === 200) {
            let answer = JSON.parse(sendRequest.responseText);
            // console.log(answer);
        }
    }

    sendRequest.open("POST", "script.php");
    sendRequest.setRequestHeader("Content-Type", "application/json");
    sendRequest.send(newCustomerRecipeFile);
}

// Portionsmengen ändern (bei Beispiel-Rezept-Objekt "rezeptIdeen", nicht in rezepte.json :( ))

let shwowMeTheRecipe = document.querySelector("#recipe-count");
let buttonInc = document.querySelector("#inc");
let buttonDesc = document.querySelector("#desc");
let peopleCount = document.querySelector("#people-count")
let recipePeopleCounter = 2;

let rezeptIdeen = {
    "rezepte": {
        "titel": "Hähnchen",
        "untertitel": "Hähnchenflügel in Ahornsirup-Marinade",
        "zutaten": [
            {"menge": 12, "einheit": "St.", "zutat": "Hähnchenflügel (à ca. 80 g)"}, 
            {"menge": 1, "einheit": "St.", "zutat": "Ingwer"},
            {"menge": 30, "einheit": "g", "zutat":   "helle Sesamsaat"},
            {"menge": 4, "einheit": "El", "zutat": "Ahornsirup"},
            {"menge": 1, "einheit": "El", "zutat": "Sojasoße"},
            {"menge": 1, "einheit": "Pr.", "zutat": "Salz"},
            {"menge": 1, "einheit": "Pr.", "zutat": "Pfeffer"},
            {"menge": 5, "einheit": "El", "zutat": "Öl"}, 
            {"menge": 1, "einheit": "", "zutat": "Bio Zitrone(n)"}, 
            {"menge": 1, "einheit": "", "zutat": "große Gefrierbeutel (ca. 6 l)"}, 
            {"menge": 1, "einheit": "St.", "zutat": "Backpapier"}],
        "zubereitung": "Flügel waschen und trocken tupfen. Ingwer schälen und fein raspeln. Sesam, Sirup und 1 EL Sojasoße vermischen. Mit Salz, Pfeffer und Ingwer würzen. Öl untermengen. Flügel in einen Gefrierbeutel geben, Marinade darübergießen. Verschließen und alles gut vermengen. Ca. 1 Stunde marinieren lassen. Flügel aus dem Beutel nehmen, nebeneinander auf ein mit Backpapier ausgelegtes Backblech legen. Im vorgeheizten Backofen (E-Herd: 200 °C/ Umluft: 175 °C/ Gas: s. Hersteller) ca. 45 Minuten braten. Zitrone heiß waschen, trocken reiben, horizontal halbieren und in Spalten schneiden. Anrichten und mit Zitronenspalten bestreuen."
    }
};

let showPeopleCount = document.createElement("p");
showPeopleCount.textContent = " Rezept für: " + recipePeopleCounter + " Personen";
peopleCount.appendChild(showPeopleCount);

let moveRecipeTitle = document.createElement("p");
let moveRecipePreparation = document.createElement("p");
let moveRecipeIngredients = document.createElement("p");
let rezeptTitel = "Titel: " + rezeptIdeen.rezepte.titel;
let rezeptZubereitung = "Zubereitung:" + rezeptIdeen.rezepte.zubereitung;
let rezeptZutaten = "Zutaten:" + JSON.stringify(rezeptIdeen.rezepte.zutaten).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge/g, "\nmenge").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/zutat:/g, "").replace(/,,/g, ",").replace(/,/g, " ").replace(/ \n/g, ",\n");

moveRecipeTitle.classList.add("recepe-title-is-there");
moveRecipePreparation.classList.add("recepte-preparation-is-there");
moveRecipeIngredients.classList.add("recepte-ingredients-are-there");
moveRecipeTitle.textContent = rezeptTitel;
moveRecipePreparation.textContent = rezeptZubereitung;
moveRecipeIngredients.textContent = rezeptZutaten;
shwowMeTheRecipe.appendChild(moveRecipeTitle);
shwowMeTheRecipe.appendChild(moveRecipePreparation);
shwowMeTheRecipe.appendChild(moveRecipeIngredients);

buttonInc.addEventListener("click", incIngredients);
buttonDesc.addEventListener("click", descIngredients);

function incIngredients () {
    if (recipePeopleCounter >= 1) {
        for (let i = 0; i < rezeptIdeen.rezepte.zutaten.length; i++) {
            let amount = rezeptIdeen.rezepte.zutaten[i].menge;
            let newAmount = (amount / recipePeopleCounter) * (recipePeopleCounter + 1);
            rezeptIdeen.rezepte.zutaten[i].menge = newAmount;
        } 
        recipePeopleCounter++;
        console.log(recipePeopleCounter);
        changeRecipe()
    }
}

function descIngredients () {
    if (recipePeopleCounter > 1) {
        for (let i = 0; i < rezeptIdeen.rezepte.zutaten.length; i++) {
            let  amount = rezeptIdeen.rezepte.zutaten[i].menge;
            let newAmount = (amount / recipePeopleCounter) * (recipePeopleCounter - 1);
            rezeptIdeen.rezepte.zutaten[i].menge = newAmount;
        }
        recipePeopleCounter--;
        console.log(recipePeopleCounter);
        changeRecipe();
    }
}

function changeRecipe () {
    rezeptZutaten = "Zutaten:" + JSON.stringify(rezeptIdeen.rezepte.zutaten).replace(/{/g, "").replace(/}/g,"").replace("[", "").replace("]", "").replace(/"/g, "").replace(/menge/g, "\nmenge").replace(/menge:/g, "").replace(/einheit:/g, "").replace(/zutat:/g, "").replace(/,,/g, ",").replace(/,/g, " ").replace(/ \n/g, ",\n");
    moveRecipeIngredients.textContent = rezeptZutaten;
    shwowMeTheRecipe.appendChild(moveRecipeIngredients);
    showPeopleCount.textContent = " Rezept für " + recipePeopleCounter + " Personen";
    peopleCount.appendChild(showPeopleCount);
}