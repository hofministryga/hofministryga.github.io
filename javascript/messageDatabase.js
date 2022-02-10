/*
Sample Code obtained and modified from https://github.com/sql-js/sql.js/
sql-wasm.wasm and sql-wasm.js obtained from https://github.com/sql-js/sql.js/
*/

config = {
    locateFile: filename => '/dist/sql-wasm.wasm'
}

// The `initSqlJs` function is globally provided by all of the main dist files if loaded in the browser.
// We must specify this locateFile function if we are loading a wasm file from anywhere other than the current html page's folder.
initSqlJs(config).then(function(SQL){
    //Create the database
    const db = new SQL.Database();
    // Run a query without reading the results
    db.run("CREATE TABLE test (col1, col2, col3);");
    // Insert two rows: (1,111) and (2,222)
    db.run("INSERT INTO test VALUES (?,?,?)", ["Title1","1/1/22","127.0.0.1"]);
    db.run("INSERT INTO test VALUES (?,?,?)", ["Title2","1/5/22","127.0.0.1"]);
    db.run("INSERT INTO test VALUES (?,?,?)", ["Title3","1/9/22","127.0.0.1"]);
    db.run("INSERT INTO test VALUES (?,?,?)", ["Title4","1/23/22","127.0.0.1"]);

    // Prepare a statement
    const stmt = db.prepare("SELECT * FROM test");
    while(stmt.step()) { //
        const row = stmt.get();
        console.log('Here is a row: ' + row);
        console.log();
        tableRow = document.createElement("tr");
        data1 = document.createElement("td");
        data2 = document.createElement("td");
        data3 = document.createElement("td");
        
        data1.innerHTML = row[0];
        data2.innerHTML = row[1];

        linkData = document.createElement("a");
        linkData.setAttribute("href", row[2]);
        linkData.innerHTML = "Download Link";

        data3.appendChild(linkData)

        tableRow.appendChild(data1);
        tableRow.appendChild(data2);
        tableRow.appendChild(data3);

        messageContainer = document.getElementById("MessageContainer");
        messageContainer.appendChild(tableRow);
    }
});