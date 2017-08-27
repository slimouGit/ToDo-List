"use strict";

window.addEventListener("load", init, false);

//**************************************************************************
var currentTimestamp;

function init() {

    if (typeof(Storage) !== "undefined") {
        console.log("storrage is active")
    } else {
        console.log("no locastorage")
    }

    var button = document.getElementById('addItem');
    button.onclick = addToDo;
    var clearButton = document.getElementById('delete');
    clearButton.onclick = deleteAll;

    var itemsArray = getItem();

    for (var i = 0; i < itemsArray.length; i++) {
        var taskNr = itemsArray[i];
        var val = JSON.parse(localStorage[taskNr]);
        insertToDom(taskNr, val);
    }

    //var help = document.getElementById('help').addEventListener('click', openHelp);

    /***************************************************************/

    checkTiming();

}

//**************************************************************************

/**
 * Funktion ueberprueft, wie hoch die Differenzzeit zwischen Erstellen des Eintrags und der aktuellen Zeit ist
 * und faerbt den Eintrag ab bestimmter Hoehe um
 */
function checkTiming(){
    var liItem = document.getElementById("entries").getElementsByTagName("li");
    console.log(liItem.length)
    var currentTime = Math.round(Date.now()/1000);
    for(var i = 0; i<liItem.length;i++){
        console.log("item Id: " + liItem[i].id);
        var itemID = liItem[i].id;

        var itemValue = document.getElementById(itemID).innerHTML;
        var listElement = document.getElementById(itemID);

        //itemID = itemID.substring(0, 10);

        console.log(itemValue);
        console.log("Start: " + itemID);
        console.log("----------------------------------------")
        console.log("Now: " + currentTime);
        if(currentTime-itemID>60&&currentTimestamp-itemID<1200){
            listElement.classList.add("warning");
        }
        if(currentTimestamp-itemID>120){
            listElement.classList.remove("warning");
            listElement.classList.add("danger");
        }

    }
}

//*************************************************************************

function getItem() {
    var itemsArray = localStorage.getItem('itemsArray');
    if (!itemsArray) {
        itemsArray = [];
        localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
    } else {
        itemsArray = JSON.parse(itemsArray);
    }
    return itemsArray;
}

//**************************************************************************

function addToDo() {
    var error = document.getElementById("error");
    var itemsArray = getItem();
    var value = document.getElementById('input').value;

    if (value != '') {
        var taskNr = Math.round(Date.now()/1000);
        var taskText = {
            'value': value
        };
        localStorage.setItem(taskNr, JSON.stringify(taskText));
        itemsArray.push(taskNr);
        localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
        insertToDom(taskNr, taskText);
        document.getElementById('input').value = '';
        error.innerHTML = "";
    } else {
        error.innerHTML = "Bitte eine Aufgabe eintragen!";
        return false;
    }
}

//**************************************************************************

function deleteToDo(e) {
    var taskNr = e.target.id;
    var itemsArray = getItem();
    if (itemsArray) {
        for (var i = 0; i < itemsArray.length; i++) {
            if (taskNr == itemsArray[i]) {
                itemsArray.splice(i, 1);
            }
        }
        localStorage.removeItem(taskNr);
        localStorage.setItem('itemsArray', JSON.stringify(itemsArray));
        deleteFromDom(taskNr);
    }
}

//**************************************************************************

function insertToDom(taskNr, ItemObj) {
    var entries = document.getElementById('entries');
    var entry = document.createElement('li');
    entry.setAttribute('id', taskNr);
    entry.innerHTML = ItemObj.value;
    entries.appendChild(entry);
    entry.onclick = deleteToDo;
}

//**************************************************************************

function deleteFromDom(taskNr) {
    var entry = document.getElementById(taskNr);
    entry.parentNode.removeChild(entry);
}

//**************************************************************************

function deleteAll() {
    localStorage.clear();
    var itemList = document.getElementById('entries');
    var entries = itemList.childNodes;
    for (var i = entries.length - 1; i >= 0; i--) {
        itemList.removeChild(entries[i]);
    }
    var itemsArray = getItem();
}

//**************************************************************************

function openHelp() {
    var text =
        '<p>Diese Anwendung dient als persönliche ToDo-Liste.</p>'+'<p>Die Einträge werden automatisch (nur in dem verwendeten Browser) gespeichert und sind auch beim nächsten Öffnen der Anwendung auf dem selben Gerät/in dem selben Browser vorhanden.</p>'+'<p>Nach Ablauf einer definierten Zeit färben sich die Einträge um. Dadurch wird die jeweilige Dringlichkeit visualisiert.</p>'+'<p>Enzelne Einträge werden gelöscht, indem sie angeklickt werden. Der gesamten Speicher wird gelöscht, indem das Mülltonnen-Icon geklickt wird.</p>';
    var popupWindow = window.open("about:blank", "newWindow",
        "width=300,height=400,left=100,top=200");
    popupWindow.document.write(text);
    popupWindow.focus();
}

//**************************************************************************