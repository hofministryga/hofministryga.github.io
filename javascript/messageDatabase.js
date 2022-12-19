/*
Sample Code obtained and modified from https://github.com/sql-js/sql.js/
sql-wasm.wasm and sql-wasm.js obtained from https://github.com/sql-js/sql.js/
*/

//Begining of Sample Code

config = {
    locateFile: filename => '/dist/sql-wasm.wasm'
}

var db;
var page;

initSqlJs(config).then(function(SQL){
    //Create the database
    const xhr = new XMLHttpRequest();

    //Format assuming main: https://api.github.com/repos/{REPO OWNER}/{REPO NAME}/contents/{PATH}
    //Format using any branch: https://api.github.com/repos/{REPO OWNER}/{REPO NAME}/contents/{PATH}?ref={BRANCH}
    
    xhr.open('GET', 'https://api.github.com/repos/hofministryga/hofministryga.github.io/contents/CMM.db?ref=db', true);
    xhr.responseType = 'text';
    
    xhr.onload = e => {
        //Parse to JSON then parse content from base64 to uint8 array. Have to do in a weird way cause javascript sucks.
        var jsonVar = JSON.parse(xhr.responseText);
        const uInt8 = new Uint8Array(base64ToUint8Array(jsonVar.content));
        db = new SQL.Database(uInt8);
        initPage();
    }
    
    xhr.send();
});

//End of Sample Code

function base64ToUint8Array(base64String)
{
    var binString = window.atob(base64String);
    var bytes = new Uint8Array(base64String.length);
    for(var i=0; i<base64String.length; i++)
    {
        bytes[i] = binString.charCodeAt(i);
    }
    return bytes.buffer;
}

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
        date.innerHTML = reformatDate(row[5]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[4]);

        mainDiv.appendChild(messageP);

        if(row[2].length != 0)
        {
            //Video Link
            downloadLink1 = document.createElement("a");
            downloadLink1.setAttribute("href", row[2]); //row[2] = video link, row[3] = audio link
            downloadLink1.innerHTML = "Video Link";
            mainDiv.appendChild(downloadLink1);
        }

        if(row[3].length != 0)
        {
            //Audio Link
            downloadLink2 = document.createElement("a");
            downloadLink2.setAttribute("href", row[3]); //row[2] = video link, row[3] = audio link
            downloadLink2.innerHTML = "Audio Link";
            mainDiv.appendChild(downloadLink2);
        }

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}

function getAllMessages() {
    // Prepare a statement
    // const countStmt = db.prepare("SELECT COUNT(*) FROM MESSAGES");
    // countStmt.step();
    // var count = Number(countStmt.get()[0]);

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
        date.innerHTML = reformatDate(row[5]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[4]);

        mainDiv.appendChild(messageP);

        if(row[2].length != 0)
        {
            //Video Link
            downloadLink1 = document.createElement("a");
            downloadLink1.setAttribute("href", row[2]); //row[2] = video link, row[3] = audio link
            downloadLink1.innerHTML = "Video Link";
            mainDiv.appendChild(downloadLink1);
        }

        if(row[3].length != 0)
        {
            //Audio Link
            downloadLink2 = document.createElement("a");
            downloadLink2.setAttribute("href", row[3]); //row[2] = video link, row[3] = audio link
            downloadLink2.innerHTML = "Audio Link";
            mainDiv.appendChild(downloadLink2);
        }

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
        date.innerHTML = reformatDate(row[5]);
        titleData2.appendChild(date);
        titleRow.appendChild(titleData2);


        //MessageText
        messageP = document.createElement("p");
        messageP.innerHTML = replaceLineBreaks(row[4]);

        mainDiv.appendChild(messageP);

        if(row[2].length != 0)
        {
            //Video Link
            downloadLink1 = document.createElement("a");
            downloadLink1.setAttribute("href", row[2]); //row[2] = video link, row[3] = audio link
            downloadLink1.innerHTML = "Video Link";
            mainDiv.appendChild(downloadLink1);
        }

        if(row[3].length != 0)
        {
            //Audio Link
            downloadLink2 = document.createElement("a");
            downloadLink2.setAttribute("href", row[3]); //row[2] = video link, row[3] = audio link
            downloadLink2.innerHTML = "Audio Link";
            mainDiv.appendChild(downloadLink2);
        }

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}
