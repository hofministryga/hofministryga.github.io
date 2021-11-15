
function loadData()
{
    var request = new XMLHttpRequest();
    const url = "https://github.com/Davidah121/6502EMU/raw/master/help.txt";
    request.open('GET', url, true);
    request.send();
    request.responseType = 'text';

    request.onreadystatechange = function() {
        if(request.status === 200)
        {
            var pObj = document.getElementById(testID);
            pObj.innerHTML = "Loaded";
        }
    }
}