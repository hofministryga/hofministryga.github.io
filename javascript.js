
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