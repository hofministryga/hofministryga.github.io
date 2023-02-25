/*
Sample Code obtained and modified from https://github.com/sql-js/sql.js/
sql-wasm.wasm and sql-wasm.js obtained from https://github.com/sql-js/sql.js/
*/

//Begining of Sample Code

config = {
    locateFile: filename => '/dist/sql-wasm.wasm'
}

var db;
var page = 0;
var pageCount = 1;
var itemsPerPage = 6;
var lastCommand = "NULL";
var lastFunctionCall = null;

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

//Obtained from https://gist.github.com/rodrigoborgesdeoliveira/987683cfbfcc8d800192da1e73adc486
//Youtube has way to many url formats
function getYouTubeVideoIdByUrl(url) {
    const reg = /^(https?:)?(\/\/)?((www\.|m\.)?youtube(-nocookie)?\.com\/((watch)?\?(feature=\w*&)?vi?=|embed\/|vi?\/|e\/)|youtu.be\/)([\w\-]{10,20})/i
    const match = url.match(reg);
    if (match) {
        return match[9];
    } else {
        return null;
    }
}

function getVideoAsEmbed(string) {
    let vidId = getYouTubeVideoIdByUrl(string);
    
    if(vidId != null)
    {
        return "https://youtube.com/embed/"+vidId;
    }

    return ""; //Not a youtube link
}

//Also, will need this later https://kb.blackbaud.com/knowledgebase/Article/121327

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

function getCount(str) {
    const stmt = db.prepare(str);
    if(stmt.step())
    {
        const row = stmt.get();
        return row[0];
    }

    return null;
}

function fixPageAndCount(itemCount, commandType)
{
    if(itemCount == null)
        return false;
    
    pageCount = Math.ceil(itemCount/itemsPerPage);
    var pageNumText = document.getElementById("PageNumID");
    page = parseInt(pageNumText.innerHTML);
    
    if(commandType != lastCommand)
    {
        pageNumText.innerHTML = "1";
        page = 0;
    }
    else
    {
        if(page > pageCount)
        {
            pageNumText.innerHTML = pageCount;
            page = pageCount;
        }
    }
    lastCommand = commandType;

    return true;
}

function pageBack()
{
    var pageNumText = document.getElementById("PageNumID");
    page = parseInt(pageNumText.innerHTML);

    if(page-1 >= 0)
        page -= 1;
    
    pageNumText.innerHTML = page+1;

    if(lastFunctionCall != null)
        lastFunctionCall();
}
function pageBackJump()
{
    var pageNumText = document.getElementById("PageNumID");
    page = parseInt(pageNumText.innerHTML);

    if(page-5 >= 0)
        page -= 5;
    else
        page = 0;
    
    pageNumText.innerHTML = page+1;

    if(lastFunctionCall != null)
        lastFunctionCall();
}
function pageFoward()
{
    var pageNumText = document.getElementById("PageNumID");
    page = parseInt(pageNumText.innerHTML);

    if(page+1 < pageCount)
        page += 1;
    
    pageNumText.innerHTML = page+1;
    
    if(lastFunctionCall != null)
        lastFunctionCall();
}
function pageForwardJump()
{
    var pageNumText = document.getElementById("PageNumID");
    page = parseInt(pageNumText.innerHTML);

    if(page+5 < pageCount)
        page += 5;
    else
        page = pageCount;
    
    pageNumText.innerHTML = page+1;
    
    if(lastFunctionCall != null)
        lastFunctionCall();
}

function getID(idValue) {

    var commandStr = "SELECT COUNT(*) FROM MESSAGES WHERE MessageID = " + idValue;
    var tmpCount = getCount(commandStr);
    
    commandStr = "SELECT * FROM MESSAGES WHERE MessageID = " + idValue;
    fixPageAndCount(tmpCount, "GetID");
    commandStr += " LIMIT " + itemsPerPage + " OFFSET " + (itemsPerPage*page);

    lastFunctionCall = function() {
        getID(idValue);
    };

    const stmt = db.prepare(commandStr);
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
            //Video as youtube iframe
            videoIFrame = document.createElement("iframe");
            videoIFrame.setAttribute("width", "320");
            videoIFrame.setAttribute("height", "240");
            videoIFrame.setAttribute("src", getVideoAsEmbed(row[2]));
            videoIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(videoIFrame);
            
        }

        if(row[3].length != 0)
        {
            //Audio Controls
            //Not tested
            audioIFrame = document.createElement("iframe");
            audioIFrame.setAttribute("width", "320");
            audioIFrame.setAttribute("height", "240");
            audioIFrame.setAttribute("src", row[3]);
            audioIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(audioIFrame);
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

    var commandStr = "SELECT COUNT(*) FROM MESSAGES";
    var tmpCount = getCount(commandStr);
    
    commandStr = "SELECT * FROM MESSAGES";
    fixPageAndCount(tmpCount, "GetAllMessages");
    commandStr += " LIMIT " + itemsPerPage + " OFFSET " + (itemsPerPage*page);

    
    lastFunctionCall = function() {
        getAllMessages();
    };

    const stmt = db.prepare(commandStr);
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
            //Video as youtube iframe
            videoIFrame = document.createElement("iframe");
            videoIFrame.setAttribute("width", "320");
            videoIFrame.setAttribute("height", "240");
            videoIFrame.setAttribute("src", getVideoAsEmbed(row[2]));
            videoIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(videoIFrame);
            
        }

        if(row[3].length != 0)
        {
            //Audio Controls
            //Not tested
            audioIFrame = document.createElement("iframe");
            audioIFrame.setAttribute("width", "320");
            audioIFrame.setAttribute("height", "240");
            audioIFrame.setAttribute("src", row[3]);
            audioIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(audioIFrame);
        }

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}

function getMessagesOptions(title, day, orderBy) {
    // Prepare a statement

    var statementString = "SELECT * FROM MESSAGES AS M ";
    var commandStr = "SELECT COUNT(*) FROM MESSAGES AS M ";
    if(day != -1)
    {
        statementString += "WHERE strftime('%w', M.DateRecorded) == " + day + " ";
        commandStr += "WHERE strftime('%w', M.DateRecorded) == " + day + " ";
    }
    
    if(title != null && title != "")
    {
        statementString += "WHERE M.Title LIKE '%" + title + "%' ";
        commandStr += "WHERE M.Title LIKE '%" + title + "%' ";
    }

    if(orderBy === true)
        statementString += "ORDER BY M.DateRecorded ASC";
    else
        statementString += "ORDER BY M.DateRecorded DESC";
    
    var tmpCount = getCount(commandStr);
    fixPageAndCount(tmpCount, "GetMessagesOptions");

    
    statementString += " LIMIT " + itemsPerPage + " OFFSET " + (itemsPerPage*page);
    
    lastFunctionCall = function() {
        getMessagesOptions(title, day, orderBy);
    };

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
            //Video as youtube iframe
            videoIFrame = document.createElement("iframe");
            videoIFrame.setAttribute("width", "320");
            videoIFrame.setAttribute("height", "240");
            videoIFrame.setAttribute("src", getVideoAsEmbed(row[2]));
            videoIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(videoIFrame);
            
        }

        if(row[3].length != 0)
        {
            //Audio Controls
            //Not tested
            audioIFrame = document.createElement("iframe");
            audioIFrame.setAttribute("width", "320");
            audioIFrame.setAttribute("height", "240");
            audioIFrame.setAttribute("src", row[3]);
            audioIFrame.setAttribute("class", "videoClass");

            mainDiv.appendChild(audioIFrame);
        }

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(mainDiv);
    }

    return isValid;
}
