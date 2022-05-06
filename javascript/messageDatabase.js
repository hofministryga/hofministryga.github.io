/*
Sample Code obtained and modified from https://github.com/sql-js/sql.js/
sql-wasm.wasm and sql-wasm.js obtained from https://github.com/sql-js/sql.js/
*/

//Begining of Sample Code

config = {
    locateFile: filename => '/dist/sql-wasm.wasm'
}
var db;

initSqlJs(config).then(function(SQL){
    //Create the database
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/dbStuff/TestDatabase.db', true);
    xhr.responseType = 'arraybuffer';

    xhr.onload = e => {
        const uInt8 = new Uint8Array(xhr.response);
        db = new SQL.Database(uInt8);
        initPage();
    }

    xhr.send();
});

//End of Sample Code

function replaceLineBreaks(string) {
    var nString = "";
    for(let i=0; i<string.length; i++)
    {
        if(string.charAt(i) === '\n')
            nString += "<br>";
        else
            nString += string.charAt(i);
    }
    return nString;
}

function reformatDate(string) {
    var nString = "";
    //date in format yyyy-mm-dd
    //change to format dd/mm/yyyy
    var splitString = string.split('-');
    nString = splitString[2] + "/" + splitString[1] + "/" + splitString[0];
    return nString;
}

function initPage() {
    cleanUp();

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const id = urlParams.get('ID');
    var isValid = false;
    if(id === "" || id === null) {
        isValid = getAllMessages();
    }
    else {
        //attempt to find specific id
        document.getElementById("TitleName").value = "Search ID = " + id;
        isValid = getID(id);
    }

    if(!isValid) {
        displayError();
    }
}

function search() {
    var isValid = false;
    cleanUp();

    var dayNum = -1;
    var asc = false;

    if(document.getElementById("allDayBut").checked)
        dayNum = -1;
    else if(document.getElementById("sundayBut").checked)
        dayNum = 0;
    else if(document.getElementById("wednesdayBut").checked)
        dayNum = 3;
    else if(document.getElementById("thursdayBut").checked)
        dayNum = 4;
    
    asc = document.getElementById("sort1").checked;
    searchText = document.getElementById("TitleName").value;

    isValid = getMessagesOptions(searchText, dayNum, asc);
    if(!isValid) {
        displayError();
    }
}

function cleanUp() {
    messageContainer = document.getElementById("MessageContainer");
    while(messageContainer.firstChild) {
        messageContainer.removeChild(messageContainer.firstChild);
    }
}

function displayError() {
    //Setup Div Stuff
    mainDiv = document.createElement("div");
    
    //Setup Error Message (Not really an error)
    error = document.createElement("h1");
    error.innerHTML = "Nothing was found.";
    mainDiv.appendChild(error);

    messageContainer = document.getElementById("MessageContainer");
    messageContainer.appendChild(mainDiv);
}

function getID(idValue) {
    const stmt = db.prepare("SELECT * FROM MESSAGES WHERE MessageID = " + idValue);
    var isValid = false;
    while(stmt.step()) { //
        const row = stmt.get();
        isValid = true;

        //Setup Div Stuff
        mainDiv = document.createElement("div");
        titleTable = document.createElement("table");
        titleRow = document.createElement("tr");

        mainDiv.appendChild(titleTable);
        titleTable.appendChild(titleRow);
        titleTable.setAttribute("class", "SubMessageTableClass");

        //TitleText
        titleData1 = document.createElement("td");
        title = document.createElement("h1");
        titleRef = document.createElement("a");
        titleRef.innerHTML = replaceLineBreaks(row[1]);
        titleRef.setAttribute("href", "messages.html?ID="+row[0]);

        title.appendChild(titleRef);
        titleData1.appendChild(title);
        titleRow.appendChild(titleData1);

        //DateText
        titleData2 = document.createElement("td");
        date = document.createElement("h2");
        date.innerHTML = reformatDate(row[4]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[3]);

        mainDiv.appendChild(messageP);

        //DownloadLink
        downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", row[2]);
        downloadLink.innerHTML = "Link";
        mainDiv.appendChild(downloadLink);

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}

function getAllMessages() {
    // Prepare a statement
    const stmt = db.prepare("SELECT * FROM MESSAGES");
    var isValid = false;
    
    while(stmt.step()) { //
        const row = stmt.get();
        isValid = true;

        //Setup Div Stuff
        mainDiv = document.createElement("div");
        titleTable = document.createElement("table");
        titleRow = document.createElement("tr");

        mainDiv.appendChild(titleTable);
        titleTable.appendChild(titleRow);
        titleTable.setAttribute("class", "SubMessageTableClass");

        //TitleText
        titleData1 = document.createElement("td");
        title = document.createElement("h1");
        titleRef = document.createElement("a");
        titleRef.innerHTML = replaceLineBreaks(row[1]);
        titleRef.setAttribute("href", "messages.html?ID="+row[0]);

        title.appendChild(titleRef);
        titleData1.appendChild(title);
        titleRow.appendChild(titleData1);

        //DateText
        titleData2 = document.createElement("td");
        date = document.createElement("h2");
        date.innerHTML = reformatDate(row[4]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[3]);

        mainDiv.appendChild(messageP);

        //DownloadLink
        downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", row[2]);
        downloadLink.innerHTML = "Link";
        mainDiv.appendChild(downloadLink);

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}

function getMessagesOptions(title, day, orderBy) {
    // Prepare a statement
    var statementString = "SELECT * FROM MESSAGES AS M ";
    if(day != -1)
        statementString += "WHERE strftime('%w', M.DateRecorded) == " + day + " ";
    
    if(title != null && title != "") {
        statementString += "WHERE M.Title LIKE '%" + title + "%' ";
    }
    
    if(title != "")

    if(orderBy === true)
        statementString += "ORDER BY M.DateRecorded ASC";
    else
        statementString += "ORDER BY M.DateRecorded DESC";

    const stmt = db.prepare(statementString);
    var isValid = false;
    
    while(stmt.step()) { //
        const row = stmt.get();
        isValid = true;

        //Setup Div Stuff
        mainDiv = document.createElement("div");
        titleTable = document.createElement("table");
        titleRow = document.createElement("tr");

        mainDiv.appendChild(titleTable);
        titleTable.appendChild(titleRow);
        titleTable.setAttribute("class", "SubMessageTableClass");

        //TitleText
        titleData1 = document.createElement("td");
        title = document.createElement("h1");
        titleRef = document.createElement("a");
        titleRef.innerHTML = replaceLineBreaks(row[1]);
        titleRef.setAttribute("href", "messages.html?ID="+row[0]);

        title.appendChild(titleRef);
        titleData1.appendChild(title);
        titleRow.appendChild(titleData1);

        //DateText
        titleData2 = document.createElement("td");
        date = document.createElement("h2");
        date.innerHTML = reformatDate(row[4]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[3]);

        mainDiv.appendChild(messageP);

        //DownloadLink
        downloadLink = document.createElement("a");
        downloadLink.setAttribute("href", row[2]);
        downloadLink.innerHTML = "Link";
        mainDiv.appendChild(downloadLink);

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}
