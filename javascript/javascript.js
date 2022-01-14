
function loadData()
{
    var request = new XMLHttpRequest();
    const url = "https://api.github.com/repos/Davidah121/GLIB/contents/README.md?ref=master";
    request.open('GET', url, true);
    request.setRequestHeader("Accept", "application/vnd.github.3.raw");
    request.send();
    request.responseType = 'text';

    request.onload = function(e) {
        alert(request.response);
    }

}

function testFunction()
{
    alert("Non cached data");
}

function toggleNavBar()
{
    var docObj = document.getElementById("navList");

    if(docObj.style.maxWidth === "132px")
    {
        docObj.style.maxWidth = "0px";
    }
    else
    {
        docObj.style.maxWidth = "132px";
    }
}

window.addEventListener("resize", function() {
    if(this.innerWidth > this.innerHeight)
    {
        //landscape
        var docObj = document.getElementById("navList");
        docObj.style.maxWidth = "none";
    }
    else
    {
        //portrait
        var docObj = document.getElementById("navList");
        docObj.style.maxWidth = "0px";
    }

}, false);